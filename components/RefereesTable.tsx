"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/common/DefaultTable";
import { useModal } from "../hooks/useModal";
import { Modal } from "./common/Modal";
import Image from "next/image";
import { User } from "@/types/types";
import profileImage from "@/public/images/profile-image.png";
import OutlinedButton from "./common/OutlinedButton";
import Link from "next/link";
import Skeleton from "./common/Skeleton";
import { Route } from "next";
import { useUsers } from "@/contexts/UsersContext";

export default function RefereesTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedReferee, setSelectedReferee] = useState<User | null>(null);
  const { users, loading, error } = useUsers();

  const handleSelectedReferee = (referee: User) => {
    setSelectedReferee(referee);
    openModal();
  };

  if (loading)
    return (
      <>
        <Skeleton className="w-full h-18 mb-2" />
        <Skeleton className="w-full h-18 mb-2" />
        <Skeleton className="w-full h-18 mb-2" />
        <Skeleton className="w-full h-18" />
      </>
    );

  if (error)
    return (
      <div className="p-4 text-sm text-center text-red-600 border border-red-200 rounded-md bg-red-50">
        Hiba történt a játékvezetők adatainak lekérése során.
      </div>
    );

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full table-auto">
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 bg-gray-50">
              <TableRow className="text-sm text-center">
                <TableCell
                  isHeader
                  className="pl-16 pr-6 py-4 font-bold text-gray-600 text-start min-w-50">
                  Név
                </TableCell>
                <TableCell
                  isHeader
                  className="px-2 py-4 font-bold text-gray-600 ">
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-bold text-gray-500 ">
                  Lakhely
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-4 font-bold text-gray-600 ">
                  Adatlap
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100">
              {users?.map((ref) => (
                <TableRow
                  key={ref.clerkUserId}
                  className="text-xs text-center">
                  <TableCell className="px-2 py-4 sm:px-6">
                    <div className="flex gap-6">
                      <Image
                        width={40}
                        height={40}
                        src={ref.image}
                        alt={ref.username}
                        className="w-10 h-10 rounded-full object-contain"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="flex flex-col text-start">
                        <span className="block text-sm font-normal text-gray-600 text-theme-s">
                          {ref.username}
                        </span>
                        <span className="block text-xs font-normal text-gray-400 text-theme-s">
                          {ref.status}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-2 text-sm font-normal text-gray-600">
                    {ref.email}
                  </TableCell>
                  <TableCell className="px-2 text-sm font-normal text-gray-600">
                    <span className="block text-sm font-normal text-gray-600 text-theme-s">
                      {ref.address?.country},
                    </span>
                    <span className="block text-xs font-normal text-gray-500 text-theme-s">
                      {ref.address?.city}
                    </span>
                  </TableCell>

                  <TableCell className="px-2 py-3 text-gray-500 text-theme-sm ">
                    <button
                      onClick={() => handleSelectedReferee(ref)}
                      className="text-sm cursor-pointer font-medium text-blue-600 hover:underline px-4 py-1 sm:py-1 w-24">
                      Megnyitás
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-175 m-4">
        <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 lg:p-11">
          <h4 className="font-semibold text-gray-800 mb-10 text-title-sm ">
            Játékvezető profil
          </h4>

          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 relative border border-gray-200 rounded-full ">
              <Image
                className="rounded-full mx-auto relative object-contain w-full aspect-square"
                width={100}
                height={100}
                src={selectedReferee?.image || profileImage}
                alt="user"
                priority={true}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-600  xl:text-left">
                {selectedReferee?.username}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 ">
                  {selectedReferee?.status}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300  xl:block"></div>
                <p className="text-sm text-gray-500 ">
                  {selectedReferee?.address?.city}
                </p>
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <Link
                target="_blank"
                rel="noreferrer"
                href={
                  (selectedReferee?.facebookUrl as Route) ||
                  "https://www.facebook.com/"
                }
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z"
                    fill=""
                  />
                </svg>
              </Link>

              <Link
                href={
                  (selectedReferee?.instagramUrl as Route) ||
                  "https://www.instagram.com/"
                }
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z"
                    fill=""
                  />
                </svg>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 mt-10 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500">Név</p>
              <p className="text-sm font-medium text-gray-800">
                {selectedReferee?.username}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-800">
                {selectedReferee?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500">
                Ország
              </p>
              <p className="text-sm font-medium text-gray-800">
                {selectedReferee?.address?.country}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500">Város</p>
              <p className="text-sm font-medium text-gray-800">
                {selectedReferee?.address?.city}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500">
                Telefon
              </p>
              <p className="text-sm font-medium text-gray-800">
                {selectedReferee?.phoneNumber}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 ">
                Státusz
              </p>
              <p className="text-sm font-medium text-gray-800">
                {selectedReferee?.status}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <OutlinedButton
              text="Bezár"
              onClick={closeModal}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
