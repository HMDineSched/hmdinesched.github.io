let scheduleData = [];
const oneDayMs = 24 * 60 * 60 * 1000; // milliseconds in a day

/**
 * Initializes the date and location selection controls based on the fetched schedule data.
 */
function initControls() {
  const datePicker = document.getElementById("date-picker");
  const locationSelect = document.getElementById("location-select");

  // Populate Date Picker
  // Ensure scheduleData is sorted by date for correct default behavior
  scheduleData.sort((a, b) => new Date(a.date) - new Date(b.date));
  const allDates = [...new Set(scheduleData.map(item => item.date))]; // Get unique sorted dates

  datePicker.innerHTML = ""; // Clear existing options
  allDates.forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = date;
    datePicker.appendChild(option);
  });

  // Set default date logic: Try today, then the first available date
  const today = new Date();
  // Format today's date to YYYY-MM-DD for comparison with schedule data
  const todayString = today.getFullYear() + '-' +
                      String(today.getMonth() + 1).padStart(2, '0') + '-' +
                      String(today.getDate()).padStart(2, '0');

  if (allDates.includes(todayString)) {
    datePicker.value = todayString;
  } else if (allDates.length > 0) {
    datePicker.value = allDates[0]; // Default to the first available date
  } else {
    datePicker.value = ""; // No dates available
    console.warn("No dates found in schedule data.");
  }

  datePicker.addEventListener("change", generateSchedule);

  // Populate Location Select
  const locationSet = new Set(scheduleData.map(item => item.location));
  locationSelect.innerHTML = ""; // Clear existing options
  locationSet.forEach(loc => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    locationSelect.appendChild(option);
  });
  // Set default location if needed, otherwise the first one
  if (locationSet.size > 0) {
    locationSelect.value = Array.from(locationSet)[0];
  }
  locationSelect.addEventListener("change", generateSchedule);
}

/**
 * Groups schedule data by location for a given date.
 * @param {string} date - The date to filter the schedule by (e.g., "YYYY-MM-DD").
 * @returns {Object} An object where keys are locations and values are arrays of staff details.
 */
function getGroupedScheduleFor(date) {
  const grouped = {};
  scheduleData
    .filter(item => item.date === date)
    .forEach(({ name, role, time, location }) => {
      if (!grouped[location]) grouped[location] = [];

      // Check if this name/role combination already exists for this location
      let existing = grouped[location].find(entry => entry.name === name && entry.role === role);
      if (!existing) {
        existing = { name, role, shifts: [] };
        grouped[location].push(existing);
      }
      existing.shifts.push(time); // Add the time to their shifts
    });
  return grouped;
}

/**
 * Generates and displays the schedule based on the selected date and location.
 */
function generateSchedule() {
  const datePicker = document.getElementById("date-picker");
  const locationSelect = document.getElementById("location-select");
  const selectedDate = datePicker.value; // e.g., "2025-06-28"
  const selectedLocation = locationSelect.value;
  const groupedData = getGroupedScheduleFor(selectedDate);

  const weekLabel = document.getElementById("week-label");
  const quickViewList = document.getElementById("quick-view-list");
  const tablesContainer = document.getElementById("tables-container");

  // --- Relative Date Indicator Logic ---
  const now = new Date();
  // Normalize today's date to UTC midnight for comparison
  const todayUtcMidnight = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  // Parse selected date string into year, month, day
  const selectedDateParts = selectedDate.split('-').map(Number);
  const selectedYear = selectedDateParts[0];
  const selectedMonth = selectedDateParts[1] - 1; // Month is 0-indexed for Date.UTC
  const selectedDay = selectedDateParts[2];

  // Create a UTC Date object for the selected day's midnight for diff calculation
  const selectedDateUtcMidnight = new Date(Date.UTC(selectedYear, selectedMonth, selectedDay));

  const diffMs = selectedDateUtcMidnight.getTime() - todayUtcMidnight.getTime();
  const diffDays = Math.round(diffMs / oneDayMs);

  let dateLabel = `Schedule for ${selectedDate}`; // Default to full date string

  // Options for toLocaleString, specifying Phoenix timezone for accurate day of week/month/day
  const optionsWeekday = { weekday: 'long', timeZone: 'America/Phoenix' };
  const optionsMonthDay = { month: 'numeric', day: 'numeric', timeZone: 'America/Phoenix' };
  const optionsFull = { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Phoenix' };

  // Create a Date object using the selected parts, then get the day of the week, etc.
  // This Date object doesn't need to be UTC or timezone-shifted, toLocaleString handles it.
  const displayDate = new Date(selectedYear, selectedMonth, selectedDay);

  const dayOfWeek = displayDate.toLocaleString('en-US', optionsWeekday);
  const monthDay = displayDate.toLocaleString('en-US', optionsMonthDay);
  const fullMonthDayYear = displayDate.toLocaleString('en-US', optionsFull);


  if (diffDays === 0) {
      dateLabel = `Schedule for Today (${selectedDate})`;
  } else if (diffDays === 1) {
      dateLabel = `Schedule for Tomorrow (${selectedDate})`;
  } else if (diffDays === -1) {
      dateLabel = `Schedule for Yesterday (${selectedDate})`;
  } else {
      // Check for "This [DayOfWeek]" (within 7 days future, excluding today/tomorrow already covered)
      if (diffDays > 0 && diffDays <= 7) {
          dateLabel = `Schedule for This ${dayOfWeek} (${monthDay})`;
      }
      // Check for "Last [DayOfWeek]" (within 7 days past, excluding yesterday already covered)
      else if (diffDays < 0 && diffDays >= -7) {
          dateLabel = `Schedule for Last ${dayOfWeek} (${monthDay})`;
      }
      // For anything else (more than 7 days away), use the full date
      else {
          dateLabel = `Schedule for ${dayOfWeek}, ${fullMonthDayYear}`;
      }
  }
  // --- End: Relative Date Indicator Logic ---


  weekLabel.textContent = dateLabel;
  quickViewList.innerHTML = "";
  tablesContainer.innerHTML = "";

  // Populate Quick View for the Selected Location
  if (groupedData[selectedLocation] && groupedData[selectedLocation].length > 0) {
    groupedData[selectedLocation].forEach(({ name, role, shifts }) => {
      const li = document.createElement("li");
      li.textContent = `${name} (${role}): ${shifts.join(", ")}`;
      quickViewList.appendChild(li);
    });
  } else {
    quickViewList.innerHTML = "<li>No shifts for the selected location on this date.</li>";
  }

  // Generate Tables for All Locations on the Selected Date
  const sortedLocations = Object.keys(groupedData).sort();

  if (sortedLocations.length === 0) {
    tablesContainer.innerHTML = "<p>No schedule data available for the selected date.</p>";
    return;
  }

  sortedLocations.forEach(location => {
    const staffList = groupedData[location];
    if (staffList.length === 0) return;

    const table = document.createElement("table");

    const caption = document.createElement("caption");
    caption.textContent = location;
    table.appendChild(caption);

    const header = document.createElement("tr");
    header.innerHTML = "<th>Name</th><th>Role</th><th>Shift(s)</th>";
    table.appendChild(header);

    staffList.forEach(({ name, role, shifts }) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${name}</td><td>${role}</td><td>${shifts.join("<br>")}</td>`;
      table.appendChild(row);
    });

    tablesContainer.appendChild(table);
  });
}

// Initial data fetch and setup when the page loads
document.addEventListener('DOMContentLoaded', () => {
  fetch('schedule.json') // STEP 1: Fetch the list of schedule filenames
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(fileNames => {
      // STEP 2: Create an array of Promises, each fetching one of the schedule files
      const fetchPromises = fileNames.map(fileName =>
        fetch(fileName)
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status} for file: ${fileName}`);
            }
            return res.json();
          })
          .catch(err => {
            console.error(`Error fetching ${fileName}:`, err);
            return []; // Return an empty array on error so Promise.all doesn't fail
          })
      );
      // STEP 3: Wait for all individual file fetches to complete
      return Promise.all(fetchPromises);
    })
    .then(allSchedules => {
      // STEP 4: Flatten the array of arrays into a single array
      scheduleData = allSchedules.flat();
      // IMPORTANT: Call initControls and generateSchedule only AFTER scheduleData is fully populated
      initControls();
      generateSchedule();
    })
    .catch(err => {
      console.error('Error in fetching or processing schedule files:', err);
      // Display a user-friendly error message if data cannot be loaded
      document.getElementById('tables-container').innerHTML = "<p>Error loading schedule data. Please try again later.</p>";
    });
});