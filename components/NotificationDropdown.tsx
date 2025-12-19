"use client";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { Dropdown } from "./common/Dropdown";
import { DropdownItem } from "./common/DropdownItem";
import { Notification } from "@/types/types";
import {
  fetchNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/actions/notificationActions";

/**
 * Formats a date to relative time in Hungarian
 * e.g., "5 perce", "2 órája", "3 napja"
 */
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "most";
  if (diffMins < 60) return `${diffMins} perce`;
  if (diffHours < 24) return `${diffHours} órája`;
  if (diffDays < 30) return `${diffDays} napja`;
  return date.toLocaleDateString("hu-HU");
};

interface NotificationDropdownProps {
  clerkUserId: string;
}

export default function NotificationDropdown({
  clerkUserId,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!clerkUserId) return;

    try {
      const [notificationsResult, countResult] = await Promise.all([
        fetchNotifications(clerkUserId, 20),
        getUnreadNotificationCount(clerkUserId),
      ]);

      if (notificationsResult.success) {
        setNotifications(notificationsResult.data);
      }
      if (countResult.success) {
        setUnreadCount(countResult.data);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [clerkUserId]);

  // Initial load of notifications
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Poll for new notifications only when the dropdown is open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [isOpen, loadNotifications]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      const result = await markNotificationAsRead(notification._id);
      if (result.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        console.error("Failed to mark notification as read:", result.error);
      }
    }
    closeDropdown();
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllNotificationsAsRead(clerkUserId);
    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } else {
      console.error("Failed to mark all notifications as read:", result.error);
    }
  };
  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-10 w-10 cursor-pointer"
        onClick={toggleDropdown}
        aria-label="Értesítések"
        aria-expanded={isOpen}>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 top-12 flex h-120 w-87.5 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg">
        <div className="flex text-gray-600 items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <h5 className="text-lg font-semibold text-gray-600">Értesítések</h5>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer">
                Összes olvasottnak jelölése
              </button>
            )}
            <button
              onClick={toggleDropdown}
              aria-label="Close notifications"
              className="text-gray-500 transition dropdown-toggle cursor-pointer">
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {loading && (
            <li className="p-4 text-center text-gray-500 text-sm">
              Betöltés...
            </li>
          )}
          {!loading && notifications.length === 0 && (
            <li className="p-4 text-center text-gray-500 text-sm">
              Nincsenek értesítések
            </li>
          )}
          {!loading &&
            notifications.map((notification) => (
              <li key={notification._id}>
                <DropdownItem
                  onItemClick={() => handleNotificationClick(notification)}
                  className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 ${
                    notification.read
                      ? "bg-white hover:bg-gray-50"
                      : "bg-blue-50 hover:bg-blue-100"
                  }`}>
                  <div className="flex-col w-full">
                    <span className="mb-1.5 block text-sm text-gray-600">
                      <span
                        className={`font-normal text-sm ${
                          notification.read ? "text-gray-600" : "text-gray-800"
                        }`}>
                        {notification.message}
                      </span>
                      <span className="w-full flex mt-2">
                        <Link
                          className="font-normal text-blue-500 text-sm"
                          href={`/merkozesek?matchId=${notification.matchId}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleNotificationClick(notification);
                          }}>
                          Megnézem a mérkőzés adatait
                        </Link>
                      </span>
                    </span>
                    <span className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                      <span>{formatRelativeTime(notification.createdAt)}</span>
                    </span>
                  </div>
                </DropdownItem>
              </li>
            ))}
        </ul>
      </Dropdown>
    </div>
  );
}
