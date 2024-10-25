
  // Generate time slots
  function generateTimeSlots() {
    const timeSelect = document.getElementById("time");
    timeSelect.innerHTML = '<option value="">Select a time</option>';

    for (let hour = 10; hour <= 18; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      timeSelect.appendChild(option);
    }
  }

  // Initialize time slots
  generateTimeSlots();

  // Store bookings in localStorage
  let bookings = JSON.parse(localStorage.getItem("tattooBookings")) || [];

  // Display bookings
  function displayBookings() {
    const bookingsList = document.getElementById("bookingsList");
    bookingsList.innerHTML = "";

    bookings.sort((a, b) => new Date(a.date) - new Date(b.date));

    bookings.forEach((booking, index) => {
      const bookingElement = document.createElement("div");
      bookingElement.className = "booking-card";
      bookingElement.innerHTML = `
                    <p style="font-weight: 600;">${booking.name}</p>
                    <p>Date: ${booking.date}</p>
                    <p>Time: ${booking.time}</p>
                    <p>Artist: ${document.getElementById("artist").options[Array.from(document.getElementById("artist").options).findIndex((opt) => opt.value === booking.artist)].text}</p>
                    <p>Size: ${booking.size}</p>
                    <button onclick="cancelBooking(${index})" class="cancel-button">
                        Cancel Booking
                    </button>
                `;
      bookingsList.appendChild(bookingElement);
    });
  }

  // Handle form submission
  const form = document.getElementById("bookingForm");
  const submitButton = document.getElementById("submitButton");
  const loadingSpinner = document.getElementById("loadingSpinner");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const booking = Object.fromEntries(formData);

    // Check for double booking
    const isDoubleBooked = bookings.some((b) => b.date === booking.date && b.time === booking.time && b.artist === booking.artist);

    if (isDoubleBooked) {
      alert("This time slot is already booked for the selected artist. Please choose another time or artist.");
      return;
    }

    // Show loading state
    submitButton.disabled = true;
    loadingSpinner.style.display = "inline-block";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Save booking locally
        bookings.push(booking);
        localStorage.setItem("tattooBookings", JSON.stringify(bookings));

        // Reset form and update display
        form.reset();
        displayBookings();

        alert("Booking submitted successfully! We will contact you shortly.");
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting your booking. Please try again or contact us directly.");
    } finally {
      // Reset button state
      submitButton.disabled = false;
      loadingSpinner.style.display = "none";
    }
  });

  // Set minimum date to today
  const dateInput = document.getElementById("date");
  dateInput.min = new Date().toISOString().split("T")[0];

  // Initial display
  displayBookings();
