"use server";

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch all calendars
async function fetchCalendarData() {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(`${apiDomain}/dashboard/calendar`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed fetch data");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Create new calendar
async function createNewCalendar(request) {
  try {
    const res = await fetch(`${apiDomain}/dashboard/calendar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: request.name,
        days: request.days,
        userSelections: request.userSelections,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed fetch data");
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}

// Update existing calendar
async function updateCalendarData(id, request) {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(`${apiDomain}/dashboard/calendar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userSelections: request.userSelections,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed fetch data");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Delete calendar
async function deleteCalendar(id, request) {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(`${apiDomain}/dashboard/calendar/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed fetch data");
    }

    return res.json();
  } catch (error) {}
}

// Fetch all calendars
async function fetchUsers() {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(`${apiDomain}/users`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed fetch data");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export {
  fetchCalendarData,
  createNewCalendar,
  updateCalendarData,
  deleteCalendar,
  fetchUsers,
};
