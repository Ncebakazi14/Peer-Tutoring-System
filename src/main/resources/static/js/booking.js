const TUTORS = [
  {
    id: 'thabang',
    name: 'Thabang Ndouvhada',
    subject: 'Computer Science',
    rating: 4.9,
    experience: '4+ years teaching',
    price: 260,
    availability: 'Mon, Wed • 7:00 PM',
    bio: 'Specializes in programming fundamentals, problem solving, and Python/JavaScript support.',
    tags: ['Python', 'JavaScript', 'Algorithms'],
    students: 42,
    responseTime: 'Usually replies in 10 min'
  },
  {
    id: 'maths',
    name: 'Megan Lewis',
    subject: 'Mathematics',
    rating: 4.9,
    experience: '2+ years teaching',
    price: 220,
    availability: 'Tue, Thu • 6:00 PM',
    bio: 'Helps students build confidence in algebra, calculus, and exam prep.',
    tags: ['Algebra', 'Calculus', 'Exam prep'],
    students: 31,
    responseTime: 'Usually replies in 20 min'
  },
  {
    id: 'physics',
    name: 'Kabelo Ndlovu',
    subject: 'Physics',
    rating: 4.7,
    experience: '1 year tutoring',
    price: 180,
    availability: 'Mon, Wed • 5:30 PM',
    bio: 'Breaks down difficult physics concepts with visual explanations.',
    tags: ['Mechanics', 'Waves', 'Formula help'],
    students: 18,
    responseTime: 'Usually replies in 15 min'
  },
  {
    id: 'chem',
    name: 'Aaliyah Khan',
    subject: 'Chemistry',
    rating: 4.8,
    experience: '3 years teaching',
    price: 210,
    availability: 'Fri • 4:00 PM',
    bio: 'Focuses on practical problem solving and strong exam technique.',
    tags: ['Organic', 'Stoichiometry', 'Labs'],
    students: 27,
    responseTime: 'Usually replies in 25 min'
  }
];

const STORAGE_KEY = 'peer_tutor_bookings';

function getBookings() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function initTutorBooking() {
  const tutorList = document.getElementById('tutorList');
  const tutorProfile = document.getElementById('tutorProfile');
  const bookingList = document.getElementById('bookingList');
  const bookingCount = document.getElementById('bookingCount');
  const bookingModal = document.getElementById('bookingModal');
  const bookingDate = document.getElementById('bookingDate');
  const bookingTime = document.getElementById('bookingTime');
  const bookingType = document.getElementById('bookingType');
  const bookingTutorName = document.getElementById('bookingTutorName');
  const bookingTutorPrice = document.getElementById('bookingTutorPrice');
  const newBookingBtn = document.getElementById('newBookingBtn');
  const closeBookingModal = document.getElementById('closeBookingModal');
  const cancelBookingBtn = document.getElementById('cancelBooking');
  const confirmBookingBtn = document.getElementById('confirmBooking');
  const tutorSearch = document.getElementById('tutorSearch');
  const subjectFilter = document.getElementById('subjectFilter');

  if (!tutorList || !tutorProfile || !bookingList) return;

  let selectedTutorId = TUTORS[0].id;

  function getFilteredTutors() {
    const searchValue = (tutorSearch?.value || '').trim().toLowerCase();
    const subjectValue = subjectFilter?.value || 'all';

    return TUTORS.filter((tutor) => {
      const matchesSearch =
        !searchValue ||
        tutor.name.toLowerCase().includes(searchValue) ||
        tutor.subject.toLowerCase().includes(searchValue) ||
        tutor.tags.some((tag) => tag.toLowerCase().includes(searchValue));

      const matchesSubject = subjectValue === 'all' || tutor.subject === subjectValue;
      return matchesSearch && matchesSubject;
    });
  }

  function highlightTutor() {
    document.querySelectorAll('.tutor-item').forEach((card) => {
      card.classList.toggle('active', card.dataset.id === selectedTutorId);
    });
  }

  function renderProfile() {
    const tutor = TUTORS.find((item) => item.id === selectedTutorId) || TUTORS[0];

    tutorProfile.innerHTML = `
      <div class="profile-top">
        <div class="tutor-avatar">${tutor.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()}</div>
        <div>
          <h4>${tutor.name}</h4>
          <p class="tutor-meta">${tutor.subject}</p>
        </div>
      </div>

      <p>${tutor.bio}</p>
      <div class="detail-grid">
        <div><span>Availability</span><strong>${tutor.availability}</strong></div>
        <div><span>Price</span><strong>R${tutor.price}/session</strong></div>
        <div><span>Students</span><strong>${tutor.students}</strong></div>
        <div><span>Response</span><strong>${tutor.responseTime}</strong></div>
      </div>

      <div class="tag-list">${tutor.tags.map(tag => `<span>${tag}</span>`).join('')}</div>

      <div class="profile-actions">
        <button class="select-btn" type="button">Message</button>
        <button class="book-btn" type="button" data-book-tutor="${tutor.id}">Book session</button>
      </div>
    `;

    const bookButton = tutorProfile.querySelector('[data-book-tutor]');
    if (bookButton) {
      bookButton.addEventListener('click', () => openBookingModal());
    }
  }

  function renderTutors() {
    const filteredTutors = getFilteredTutors();

    if (!filteredTutors.length) {
      tutorList.innerHTML = '<div class="empty-state">No tutors match your search.</div>';
      return;
    }

    tutorList.innerHTML = filteredTutors.map((tutor) => `
      <article class="tutor-item" data-id="${tutor.id}">
        <div class="tutor-avatar">${tutor.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()}</div>
        <div class="tutor-info">
          <h4>${tutor.name}</h4>
          <p class="tutor-meta">${tutor.subject}</p>
          <small>${tutor.experience}</small>
          <div class="mini-tags">${tutor.tags.slice(0, 2).map(tag => `<span>${tag}</span>`).join('')}</div>
        </div>
        <div class="tutor-rating-wrap">
          <div class="tutor-rating">★ ${tutor.rating}</div>
          <div class="tutor-price">R${tutor.price}</div>
        </div>
      </article>
    `).join('');

    tutorList.querySelectorAll('.tutor-item').forEach((card) => {
      card.addEventListener('click', () => {
        selectedTutorId = card.dataset.id;
        renderProfile();
        highlightTutor();
      });
    });

    highlightTutor();
    renderProfile();
  }

  function openBookingModal() {
    const tutor = TUTORS.find((item) => item.id === selectedTutorId) || TUTORS[0];
    bookingTutorName.textContent = tutor.name;
    bookingTutorPrice.textContent = `R${tutor.price}/session`;

    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 2);
    bookingDate.value = nextDate.toISOString().split('T')[0];

    bookingModal.classList.remove('hidden');
    bookingModal.setAttribute('aria-hidden', 'false');
  }

  function closeBookingModalPanel() {
    bookingModal.classList.add('hidden');
    bookingModal.setAttribute('aria-hidden', 'true');
  }

  function renderBookings() {
    const bookings = getBookings();
    bookingCount.textContent = String(bookings.length);

    if (!bookings.length) {
      bookingList.innerHTML = '<div class="empty-state">No bookings yet. Pick a tutor to start.</div>';
      return;
    }

    bookingList.innerHTML = bookings.map((booking) => `
      <article class="booking-item">
        <div class="booking-top">
          <span>${booking.tutorName}</span>
          <span class="booking-status">${booking.status}</span>
        </div>
        <p>${booking.subject}</p>
        <small>${booking.date} • ${booking.time}</small>
        <small>R${booking.amount}</small>
      </article>
    `).join('');
  }

  if (newBookingBtn) {
    newBookingBtn.addEventListener('click', openBookingModal);
  }

  if (closeBookingModal) {
    closeBookingModal.addEventListener('click', closeBookingModalPanel);
  }

  if (cancelBookingBtn) {
    cancelBookingBtn.addEventListener('click', closeBookingModalPanel);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (event) => {
      if (event.target === bookingModal) {
        closeBookingModalPanel();
      }
    });
  }

  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      const tutor = TUTORS.find((item) => item.id === selectedTutorId) || TUTORS[0];
      const selectedDate = bookingDate.value || new Date().toISOString().split('T')[0];
      const selectedTime = bookingTime.value || '18:00';
      const sessionType = bookingType.value || 'Revision';

      const booking = {
        id: Date.now(),
        tutorId: tutor.id,
        tutorName: tutor.name,
        subject: tutor.subject,
        amount: tutor.price,
        date: new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: `${selectedTime} • ${sessionType}`,
        status: 'Confirmed'
      };

      const bookings = getBookings();
      bookings.unshift(booking);
      saveBookings(bookings);
      renderBookings();
      closeBookingModalPanel();
    });
  }

  if (tutorSearch) {
    tutorSearch.addEventListener('input', renderTutors);
  }

  if (subjectFilter) {
    subjectFilter.addEventListener('change', renderTutors);
  }

  renderTutors();
  renderBookings();
}

document.addEventListener('DOMContentLoaded', initTutorBooking);
