
        // Global variables
        let currentUser = null;
        let users = [];
        let bookings = [];
        let activities = [];
        let events = [];
        let isAdmin = false;
        let currentDate = new Date();
        let currentEditingActivity = null;
        let currentEditingEvent = null;

        // Initialize the app with enhanced features
        document.addEventListener('DOMContentLoaded', function() {
            loadDemoData();
            checkAuthState();
            generateCalendar();
            loadActivities();
            loadEvents();
            setMinBookingDate();
            initializeParticles();
            initializeScrollEffects();
            
            // Set hero video fallback with enhanced background
            const heroVideo = document.querySelector('.hero-video');
            if (heroVideo) {
                heroVideo.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #065f46 50%, #10b981 100%)';
            }
        });

        // Enhanced Particle System
        function initializeParticles() {
            const particlesContainer = document.getElementById('heroParticles');
            if (!particlesContainer) return;

            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 4 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Enhanced Scroll Effects
        function initializeScrollEffects() {
            const header = document.getElementById('header');
            
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                
                // Header scroll effect
                if (scrolled > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Parallax effect for hero background
                const heroBackground = document.querySelector('.hero-background');
                if (heroBackground) {
                    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
                }

                // Animate elements on scroll
                const elements = document.querySelectorAll('.stat-card, .activity-card, .event-card');
                elements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const elementVisible = 150;
                    
                    if (elementTop < window.innerHeight - elementVisible) {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }
                });
            });

            // Set initial state for animated elements
            const elements = document.querySelectorAll('.stat-card, .activity-card, .event-card');
            elements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
        }

        // Mobile Menu Toggle
        function toggleMobileMenu() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        }

        // Enhanced Authentication Functions
        function signup(event) {
            event.preventDefault();
            
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const phone = document.getElementById('signupPhone').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }

            if (users.find(user => user.email === email)) {
                showNotification('User with this email already exists!', 'error');
                return;
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                password: password,
                registrationDate: new Date().toISOString(),
                emergencyContact: '',
                status: 'active'
            };

            users.push(newUser);
            currentUser = newUser;
            saveToStorage();
            
            closeModal('signupModal');
            updateAuthUI();
            showDashboard();
            showNotification('Welcome to Zetu Adventures! Your epic journey begins now! 🎉', 'success');
        }

        function login(event) {
            event.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                closeModal('loginModal');
                updateAuthUI();
                showDashboard();
                showNotification(`Welcome back, ${user.name}! Ready for your next adventure? 🌟`, 'success');
            } else {
                showNotification('Invalid email or password! Please try again.', 'error');
            }
        }

        function adminLogin() {
            closeModal('loginModal');
            openModal('adminLoginModal');
        }

        function adminLoginSubmit(event) {
            event.preventDefault();
            
            const email = document.getElementById('adminEmail').value.trim();
            const password = document.getElementById('adminPassword').value;

            if (email === 'admin@zetuadventures.co.ke' && password === 'admin123') {
                currentUser = {
                    id: 'admin',
                    name: 'Admin',
                    email: email,
                    role: 'admin'
                };
                isAdmin = true;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                closeModal('adminLoginModal');
                updateAuthUI();
                showDashboard();
                showNotification('Admin access granted! Welcome to the control center! ⚡', 'success');
            } else {
                showNotification('Invalid admin credentials!', 'error');
            }
        }

        function logout() {
            currentUser = null;
            isAdmin = false;
            localStorage.removeItem('currentUser');
            updateAuthUI();
            showHome();
            showNotification('Successfully logged out. See you on your next adventure! 👋', 'info');
        }

        function checkAuthState() {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                if (currentUser.role === 'admin') {
                    isAdmin = true;
                }
                updateAuthUI();
            }
        }

        function updateAuthUI() {
            const authButtons = document.getElementById('authButtons');
            const userMenu = document.getElementById('userMenu');
            const welcomeText = document.getElementById('welcomeText');

            if (currentUser) {
                authButtons.classList.add('hidden');
                userMenu.classList.remove('hidden');
                welcomeText.textContent = `Welcome, ${currentUser.name}!`;
            } else {
                authButtons.classList.remove('hidden');
                userMenu.classList.add('hidden');
            }
        }

        // Enhanced Navigation Functions
        function showHome() {
            document.getElementById('homepage').style.display = 'block';
            document.getElementById('userDashboard').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'none';
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function showDashboard() {
            document.getElementById('homepage').style.display = 'none';
            
            if (isAdmin) {
                document.getElementById('userDashboard').style.display = 'none';
                document.getElementById('adminDashboard').style.display = 'block';
                loadAdminData();
            } else {
                document.getElementById('userDashboard').style.display = 'block';
                document.getElementById('adminDashboard').style.display = 'none';
                loadUserData();
            }
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Enhanced Modal Functions
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Add animation class
            setTimeout(() => {
                modal.classList.add('fade-in');
            }, 10);
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            modal.classList.remove('fade-in');
            resetModalForms();
        }

        function resetModalForms() {
            document.querySelectorAll('.modal form').forEach(form => form.reset());
            document.querySelectorAll('.image-preview').forEach(img => img.classList.add('hidden'));
            currentEditingActivity = null;
            currentEditingEvent = null;
            
            // Reset modal titles
            const activityTitle = document.getElementById('activityModalTitle');
            const eventTitle = document.getElementById('eventModalTitle');
            if (activityTitle) activityTitle.innerHTML = '<i class="fas fa-plus"></i> Add New Activity';
            if (eventTitle) eventTitle.innerHTML = '<i class="fas fa-plus"></i> Add New Event';
        }

        // Enhanced Tab Switching Functions
        function switchTab(tabName) {
            // Remove active class from all tabs and sections
            document.querySelectorAll('#userDashboard .dashboard-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('#userDashboard .dashboard-section').forEach(section => section.classList.remove('active'));

            // Add active class to clicked tab and corresponding section
            event.target.classList.add('active');
            document.getElementById(tabName + '-section').classList.add('active');
        }

        function switchAdminTab(tabName) {
            // Remove active class from all tabs and sections
            document.querySelectorAll('#adminDashboard .dashboard-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('#adminDashboard .dashboard-section').forEach(section => section.classList.remove('active'));

            // Add active class to clicked tab and corresponding section
            event.target.classList.add('active');
            document.getElementById('admin-' + tabName + '-section').classList.add('active');

            if (tabName === 'analytics') {
                updateAnalytics();
            }
        }

        // Enhanced Activity Management Functions
        function loadActivities() {
            const activitiesGrid = document.getElementById('activitiesGrid');
            const tourSelect = document.getElementById('tourSelect');
            const eventActivitySelect = document.getElementById('eventActivity');
            
            if (activities.length === 0) {
                activitiesGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 5rem;">
                        <i class="fas fa-mountain" style="font-size: 5rem; color: var(--primary); margin-bottom: 2rem; animation: float 3s ease-in-out infinite;"></i>
                        <h3 style="font-size: 2rem; margin-bottom: 1rem; color: var(--dark);">No adventures yet</h3>
                        <p style="font-size: 1.2rem; color: #64748b;">Epic adventures are being prepared. Check back soon!</p>
                    </div>
                `;
                if (tourSelect) tourSelect.innerHTML = '<option value="">No activities available</option>';
                if (eventActivitySelect) eventActivitySelect.innerHTML = '<option value="">No activities available</option>';
                return;
            }

            let html = '';
            let selectHtml = '<option value="">Select an adventure...</option>';
            let eventSelectHtml = '<option value="">Select activity...</option>';

            activities.forEach(activity => {
                const features = activity.features ? activity.features.split(',').map(f => f.trim()) : [];
                
                html += `
                    <div class="activity-card">
                        <div class="activity-image">
                            ${activity.imageUrl ? `<img src="${activity.imageUrl}" alt="${activity.name}">` : ''}
                            <div class="overlay">
                                <i class="fas fa-mountain icon"></i>
                            </div>
                        </div>
                        <div class="activity-content">
                            <h3 class="activity-title">${activity.name}</h3>
                            <p class="activity-description">${activity.description}</p>
                            <div class="activity-meta">
                                <div class="activity-price">KSH ${parseInt(activity.price).toLocaleString()}</div>
                                <div class="activity-duration">
                                    <i class="fas fa-clock"></i> ${activity.duration}
                                </div>
                            </div>
                            ${features.length > 0 ? `
                                <div class="activity-features">
                                    ${features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                                </div>
                            ` : ''}
                            <button class="btn btn-primary" onclick="bookActivity('${activity.name}')" style="width: 100%; font-size: 1.1rem;">
                                <i class="fas fa-calendar-plus"></i> Book Adventure
                            </button>
                        </div>
                    </div>
                `;

                selectHtml += `<option value="${activity.name}" data-price="${activity.price}">${activity.name} - KSH ${parseInt(activity.price).toLocaleString()}</option>`;
                eventSelectHtml += `<option value="${activity.id}">${activity.name}</option>`;
            });

            activitiesGrid.innerHTML = html;
            if (tourSelect) tourSelect.innerHTML = selectHtml;
            if (eventActivitySelect) eventActivitySelect.innerHTML = eventSelectHtml;
        }

        function bookActivity(activityName) {
            if (!currentUser) {
                openModal('signupModal');
                showNotification('Please create an account to book adventures! 🎯', 'info');
                return;
            }
            
            showDashboard();
            switchTab('book-tour');
            document.getElementById('tourSelect').value = activityName;
        }

        function saveActivity(event) {
            event.preventDefault();
            
            const name = document.getElementById('activityName').value.trim();
            const description = document.getElementById('activityDescription').value.trim();
            const price = document.getElementById('activityPrice').value;
            const duration = document.getElementById('activityDuration').value.trim();
            const features = document.getElementById('activityFeatures').value.trim();
            const imagePreview = document.getElementById('activityImagePreview');
            const activityId = document.getElementById('activityId').value;
            
            const activityData = {
                name,
                description,
                price: parseInt(price),
                duration,
                features,
                imageUrl: imagePreview.src || null,
                createdAt: new Date().toISOString()
            };

            if (activityId) {
                // Edit existing activity
                const index = activities.findIndex(a => a.id == activityId);
                activities[index] = { ...activities[index], ...activityData };
                showNotification('Activity updated successfully! 🎉', 'success');
            } else {
                // Add new activity
                activityData.id = Date.now();
                activities.push(activityData);
                showNotification('New activity added successfully! 🌟', 'success');
            }

            saveToStorage();
            loadActivities();
            loadAdminActivities();
            closeModal('activityModal');
        }

        function editActivity(id) {
            const activity = activities.find(a => a.id == id);
            if (!activity) return;

            currentEditingActivity = activity;
            
            document.getElementById('activityModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Activity';
            document.getElementById('activityName').value = activity.name;
            document.getElementById('activityDescription').value = activity.description;
            document.getElementById('activityPrice').value = activity.price;
            document.getElementById('activityDuration').value = activity.duration;
            document.getElementById('activityFeatures').value = activity.features || '';
            document.getElementById('activityId').value = activity.id;
            
            if (activity.imageUrl) {
                const preview = document.getElementById('activityImagePreview');
                preview.src = activity.imageUrl;
                preview.classList.remove('hidden');
            }
            
            openModal('activityModal');
        }

        function deleteActivity(id) {
            if (confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
                activities = activities.filter(a => a.id != id);
                saveToStorage();
                loadActivities();
                loadAdminActivities();
                showNotification('Activity deleted successfully! 🗑️', 'info');
            }
        }

        function loadAdminActivities() {
            const container = document.getElementById('adminActivitiesList');
            
            if (activities.length === 0) {
                container.innerHTML = `
                    <div class="text-center" style="padding: 4rem;">
                        <i class="fas fa-mountain" style="font-size: 4rem; color: var(--primary); animation: float 3s ease-in-out infinite;"></i>
                        <h4 style="font-size: 1.5rem; margin: 1rem 0; color: var(--dark);">No activities yet</h4>
                        <p style="color: #64748b; font-size: 1.1rem;">Start by adding your first adventure!</p>
                    </div>
                `;
                return;
            }

            let html = '<div style="overflow-x: auto;"><table class="data-table"><thead><tr><th>Activity</th><th>Price</th><th>Duration</th><th>Created</th><th>Actions</th></tr></thead><tbody>';
            
            activities.forEach(activity => {
                html += `
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 1.5rem;">
                                ${activity.imageUrl ? `<img src="${activity.imageUrl}" style="width: 60px; height: 60px; border-radius: 15px; object-fit: cover;">` : '<div style="width: 60px; height: 60px; background: var(--gradient); border-radius: 15px; display: flex; align-items: center; justify-content: center; color: white;"><i class="fas fa-mountain"></i></div>'}
                                <div>
                                    <strong style="font-size: 1.1rem;">${activity.name}</strong>
                                    <br><small style="color: #64748b;">${activity.description.substring(0, 60)}...</small>
                                </div>
                            </div>
                        </td>
                        <td><strong style="color: var(--primary); font-size: 1.1rem;">KSH ${parseInt(activity.price).toLocaleString()}</strong></td>
                        <td style="font-weight: 600;">${activity.duration}</td>
                        <td>${new Date(activity.createdAt).toLocaleDateString()}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-small btn-warning" onclick="editActivity(${activity.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-small btn-danger" onclick="deleteActivity(${activity.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            
            html += '</tbody></table></div>';
            container.innerHTML = html;
        }

        // Enhanced Event Management Functions
        function loadEvents() {
            loadEventsList();
            generateCalendar();
            loadAdminEvents();
        }

        function loadEventsList() {
            const container = document.getElementById('eventsList');
            const upcomingEvents = events
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5);

            if (upcomingEvents.length === 0) {
                container.innerHTML = `
                    <div class="text-center" style="padding: 4rem;">
                        <i class="fas fa-calendar-alt" style="font-size: 4rem; color: var(--primary); animation: float 3s ease-in-out infinite;"></i>
                        <h4 style="font-size: 1.8rem; margin: 1rem 0; color: var(--dark);">No upcoming events</h4>
                        <p style="font-size: 1.2rem; color: #64748b;">New adventures are being planned. Stay tuned!</p>
                    </div>
                `;
                return;
            }

            let html = '';
            upcomingEvents.forEach(event => {
                const activity = activities.find(a => a.id == event.activityId);
                html += `
                    <div class="event-card">
                        <div class="event-header">
                            <h4 class="event-title">${event.title}</h4>
                            <div class="event-date">${new Date(event.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                            })}</div>
                        </div>
                        <p style="font-size: 1.1rem; color: #64748b; margin-bottom: 1rem;">${event.description}</p>
                        ${activity ? `<p style="font-weight: 600; color: var(--primary);"><i class="fas fa-mountain"></i> <strong>Activity:</strong> ${activity.name}</p>` : ''}
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        function saveEvent(event) {
            event.preventDefault();
            
            const title = document.getElementById('eventTitle').value.trim();
            const description = document.getElementById('eventDescription').value.trim();
            const date = document.getElementById('eventDate').value;
            const activityId = document.getElementById('eventActivity').value;
            const eventId = document.getElementById('eventId').value;
            
            const eventData = {
                title,
                description,
                date,
                activityId: activityId || null,
                createdAt: new Date().toISOString()
            };

            if (eventId) {
                // Edit existing event
                const index = events.findIndex(e => e.id == eventId);
                events[index] = { ...events[index], ...eventData };
                showNotification('Event updated successfully! 📅', 'success');
            } else {
                // Add new event
                eventData.id = Date.now();
                events.push(eventData);
                showNotification('New event added successfully! 🎉', 'success');
            }

            saveToStorage();
            loadEvents();
            closeModal('eventModal');
        }

        function editEvent(id) {
            const event = events.find(e => e.id == id);
            if (!event) return;

            currentEditingEvent = event;
            
            document.getElementById('eventModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Event';
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDescription').value = event.description;
            document.getElementById('eventDate').value = event.date;
            document.getElementById('eventActivity').value = event.activityId || '';
            document.getElementById('eventId').value = event.id;
            
            openModal('eventModal');
        }

        function deleteEvent(id) {
            if (confirm('Are you sure you want to delete this event?')) {
                events = events.filter(e => e.id != id);
                saveToStorage();
                loadEvents();
                showNotification('Event deleted successfully! 🗑️', 'info');
            }
        }

        function loadAdminEvents() {
            const container = document.getElementById('adminEventsList');
            
            if (events.length === 0) {
                container.innerHTML = `
                    <div class="text-center" style="padding: 4rem;">
                        <i class="fas fa-calendar-plus" style="font-size: 4rem; color: var(--primary); animation: float 3s ease-in-out infinite;"></i>
                        <h4 style="font-size: 1.5rem; margin: 1rem 0; color: var(--dark);">No events yet</h4>
                        <p style="color: #64748b; font-size: 1.1rem;">Create your first event to get started!</p>
                    </div>
                `;
                return;
            }

            let html = '<div style="overflow-x: auto;"><table class="data-table"><thead><tr><th>Event</th><th>Date</th><th>Activity</th><th>Created</th><th>Actions</th></tr></thead><tbody>';
            
            events.forEach(event => {
                const activity = activities.find(a => a.id == event.activityId);
                html += `
                    <tr>
                        <td>
                            <strong style="font-size: 1.1rem;">${event.title}</strong>
                            <br><small style="color: #64748b;">${event.description}</small>
                        </td>
                        <td style="font-weight: 600;">${new Date(event.date).toLocaleDateString()}</td>
                        <td>${activity ? activity.name : '<em style="color: #94a3b8;">No activity linked</em>'}</td>
                        <td>${new Date(event.createdAt).toLocaleDateString()}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-small btn-warning" onclick="editEvent(${event.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-small btn-danger" onclick="deleteEvent(${event.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            
            html += '</tbody></table></div>';
            container.innerHTML = html;
        }

        // Enhanced Calendar Functions
        function generateCalendar() {
            const grid = document.getElementById('calendarGrid');
            const monthYear = document.getElementById('monthYear');
            
            if (!grid || !monthYear) return;
            
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            monthYear.textContent = new Date(year, month).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });

            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();

            let html = '';
            
            // Add day headers
            const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            dayHeaders.forEach(day => {
                html += `<div class="calendar-day header">${day}</div>`;
            });

            // Add empty cells for days before the first day of the month
            for (let i = 0; i < firstDay; i++) {
                html += `<div class="calendar-day other-month"></div>`;
            }

            // Add days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateString = date.toISOString().split('T')[0];
                const dayEvents = events.filter(event => event.date === dateString);
                
                let classes = 'calendar-day';
                if (date.toDateString() === today.toDateString()) {
                    classes += ' today';
                }

                html += `
                    <div class="${classes}">
                        <div class="day-number">${day}</div>
                        ${dayEvents.map(event => '<div class="event-indicator"></div>').join('')}
                        ${dayEvents.length > 0 ? `<div class="event-count">${dayEvents.length}</div>` : ''}
                    </div>
                `;
            }

            grid.innerHTML = html;
        }

        function previousMonth() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar();
        }

        function nextMonth() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar();
        }

        // Enhanced Booking Functions
        function setMinBookingDate() {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const travelDateInput = document.getElementById('travelDate');
            if (travelDateInput) {
                travelDateInput.min = tomorrow.toISOString().split('T')[0];
            }
        }

        function submitBooking(event) {
            event.preventDefault();
            
            if (!currentUser) {
                showNotification('Please log in to book an adventure!', 'error');
                return;
            }

            const tour = document.getElementById('tourSelect').value;
            const travelDate = document.getElementById('travelDate').value;
            const groupSize = document.getElementById('groupSize').value;
            const paymentCode = document.getElementById('paymentCode').value.trim();
            const specialRequests = document.getElementById('specialRequests').value.trim();

            if (!tour || !travelDate || !paymentCode) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }

            const booking = {
                id: Date.now(),
                userId: currentUser.id,
                userName: currentUser.name,
                userEmail: currentUser.email,
                tour: tour,
                travelDate: travelDate,
                groupSize: parseInt(groupSize),
                paymentCode: paymentCode,
                specialRequests: specialRequests,
                status: 'Pending',
                bookingDate: new Date().toISOString()
            };

            bookings.push(booking);
            saveToStorage();

            document.getElementById('bookingForm').reset();
            setMinBookingDate();
            
            showNotification('Booking submitted successfully! We\'ll verify your payment and get back to you soon. 🎉', 'success');
            switchTab('bookings');
            loadUserBookings();
        }

        function updateBookingStatus(bookingId, status) {
            const booking = bookings.find(b => b.id == bookingId);
            if (booking) {
                booking.status = status;
                saveToStorage();
                loadAdminBookings();
                updateAnalytics();
                showNotification(`Booking ${status.toLowerCase()} successfully!`, 'success');
            }
        }

        // Enhanced User Data Functions
        function loadUserData() {
            loadUserBookings();
            loadUserProfile();
        }

        function loadUserBookings() {
    if (!currentUser) return;

    const userBookings = bookings.filter(booking => booking.userId === currentUser.id);
    const container = document.getElementById('userBookings');

    if (userBookings.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 4rem;">
                <i class="fas fa-compass" style="font-size: 5rem; color: var(--primary); margin-bottom: 2rem; animation: float 3s ease-in-out infinite;"></i>
                <h4 style="font-size: 1.8rem; margin-bottom: 1rem; color: var(--dark);">No adventures booked yet!</h4>
                <p style="font-size: 1.3rem; color: #64748b; margin-bottom: 3rem;">Your journey is waiting to begin. Book your first adventure and create unforgettable memories!</p>
                <a href="#" onclick="switchTab('book-tour')" class="btn btn-primary" style="font-size: 1.1rem; padding: 1.2rem 3rem;">
                    <i class="fas fa-plus"></i> Book Your First Adventure
                </a>
            </div>
        `;
        return;
    }

    let html = '';
    userBookings.forEach(booking => {
        const statusClass = booking.status.toLowerCase().replace(' ', '-');
        const statusIcon = booking.status === 'Confirmed' ? 'check-circle' : 
                         booking.status === 'Rejected' ? 'times-circle' : 'clock';
        
        html += `
            <div class="event-card" style="border-left-color: ${booking.status === 'Confirmed' ? 'var(--success)' : booking.status === 'Rejected' ? 'var(--danger)' : 'var(--warning)'};">
                <div class="event-header">
                    <h4 style="font-size: 1.4rem;">${booking.tour}</h4>
                    <span class="status-badge status-${statusClass}">
                        <i class="fas fa-${statusIcon}"></i> ${booking.status}
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin: 1.5rem 0;">
                    <div>
                        <strong>Travel Date:</strong><br>
                        <i class="fas fa-calendar"></i> ${new Date(booking.travelDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                    <div>
                        <strong>Group Size:</strong><br>
                        <i class="fas fa-users"></i> ${booking.groupSize} traveler${booking.groupSize > 1 ? 's' : ''}
                    </div>
                    <div>
                        <strong>Payment Code:</strong><br>
                        <i class="fas fa-mobile-alt"></i> ${booking.paymentCode}
                    </div>
                    <div>
                        <strong>Booked On:</strong><br>
                        <i class="fas fa-clock"></i> ${new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                </div>
                ${booking.specialRequests ? `
                    <div style="margin-top: 1.5rem; padding: 1.5rem; background: var(--light); border-radius: 15px;">
                        <strong><i class="fas fa-sticky-note"></i> Special Requests:</strong><br>
                        ${booking.specialRequests}
                    </div>
                ` : ''}
                ${booking.status === 'Confirmed' ? `
                    <div style="margin-top: 1.5rem; padding: 1.5rem; background: rgba(5, 150, 105, 0.1); border-radius: 15px; color: var(--success);">
                        <i class="fas fa-check-circle"></i> <strong>Confirmed!</strong> We'll contact you soon with detailed trip information and packing lists.
                    </div>
                    <div style="text-align: center; margin-top: 1.5rem;">
                        <a href="#" onclick="downloadTicket(${booking.id})" class="download-ticket-btn">
                            <i class="fas fa-ticket-alt"></i> Download Ticket
                        </a>
                    </div>
                ` : booking.status === 'Rejected' ? `
                    <div style="margin-top: 1.5rem; padding: 1.5rem; background: rgba(220, 38, 38, 0.1); border-radius: 15px; color: var(--danger);">
                        <i class="fas fa-exclamation-triangle"></i> <strong>Booking Issue:</strong> Please contact us for more information.
                    </div>
                ` : `
                    <div style="margin-top: 1.5rem; padding: 1.5rem; background: rgba(217, 119, 6, 0.1); border-radius: 15px; color: var(--warning);">
                        <i class="fas fa-hourglass-half"></i> <strong>Pending Review:</strong> We're verifying your payment and will confirm shortly.
                    </div>
                `}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

        function loadUserProfile() {
            if (!currentUser) return;

            document.getElementById('fullName').value = currentUser.name || '';
            document.getElementById('email').value = currentUser.email || '';
            document.getElementById('phone').value = currentUser.phone || '';
            document.getElementById('emergencyContact').value = currentUser.emergencyContact || '';
        }

        function updateProfile(event) {
            event.preventDefault();
            
            if (!currentUser) return;

            currentUser.name = document.getElementById('fullName').value.trim();
            currentUser.email = document.getElementById('email').value.trim();
            currentUser.phone = document.getElementById('phone').value.trim();
            currentUser.emergencyContact = document.getElementById('emergencyContact').value.trim();

            const userIndex = users.findIndex(user => user.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...currentUser };
            }
            
            saveToStorage();
            updateAuthUI();
            showNotification('Profile updated successfully! 👤', 'success');
        }

        // Enhanced Admin Data Functions
        function loadAdminData() {
            loadAdminActivities();
            loadAdminEvents();
            loadAdminBookings();
            loadAdminUsers();
            updateAnalytics();
        }

        function loadAdminBookings() {
            const tbody = document.getElementById('adminBookingsTable');
            
            if (bookings.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center" style="padding: 3rem; font-size: 1.1rem; color: #64748b;">No bookings yet. When customers make bookings, they\'ll appear here.</td></tr>';
                return;
            }

            let html = '';
            bookings.forEach(booking => {
                const statusClass = booking.status.toLowerCase().replace(' ', '-');
                const activity = activities.find(a => a.name === booking.tour);
                const price = activity ? parseInt(activity.price) * booking.groupSize : 0;
                
                html += `
                    <tr>
                        <td><strong style="color: var(--primary);">#${booking.id}</strong></td>
                        <td>
                            <div>
                                <strong style="font-size: 1.05rem;">${booking.userName}</strong><br>
                                <small style="color: #64748b;">${booking.userEmail}</small>
                            </div>
                        </td>
                        <td>
                            <strong style="color: var(--dark);">${booking.tour}</strong><br>
                            <small style="color: var(--primary); font-weight: 600;">KSH ${price.toLocaleString()}</small>
                        </td>
                        <td style="font-weight: 600;">${new Date(booking.travelDate).toLocaleDateString()}</td>
                        <td><i class="fas fa-users"></i> <strong>${booking.groupSize}</strong></td>
                        <td><code style="background: var(--light); padding: 0.3rem 0.6rem; border-radius: 8px; font-weight: 600;">${booking.paymentCode}</code></td>
                        <td>
                            <span class="status-badge status-${statusClass}">
                                <i class="fas fa-${booking.status === 'Confirmed' ? 'check-circle' : booking.status === 'Rejected' ? 'times-circle' : 'clock'}"></i>
                                ${booking.status}
                            </span>
                        </td>
                        <td>
                            ${booking.status === 'Pending' ? `
                                <div class="action-buttons">
                                    <button class="btn btn-small btn-success" onclick="updateBookingStatus(${booking.id}, 'Confirmed')" title="Confirm Booking">
                                        <i class="fas fa-check"></i> Confirm
                                    </button>
                                    <button class="btn btn-small btn-danger" onclick="updateBookingStatus(${booking.id}, 'Rejected')" title="Reject Booking">
                                        <i class="fas fa-times"></i> Reject
                                    </button>
                                </div>
                            ` : `
                                <span style="color: #64748b; font-size: 0.95rem; font-weight: 500;">
                                    <i class="fas fa-check"></i> Processed
                                </span>
                            `}
                        </td>
                    </tr>
                `;
            });
            
            tbody.innerHTML = html;
        }

        function loadAdminUsers() {
            const tbody = document.getElementById('adminUsersTable');
            
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding: 3rem; font-size: 1.1rem; color: #64748b;">No users registered yet.</td></tr>';
                return;
            }

            let html = '';
            users.forEach(user => {
                const userBookings = bookings.filter(booking => booking.userId === user.id);
                const totalSpent = userBookings.reduce((sum, booking) => {
                    if (booking.status === 'Confirmed') {
                        const activity = activities.find(a => a.name === booking.tour);
                        return sum + (activity ? parseInt(activity.price) * booking.groupSize : 0);
                    }
                    return sum;
                }, 0);
                
                html += `
                    <tr>
                        <td>
                            <div>
                                <strong style="font-size: 1.05rem;">${user.name}</strong><br>
                                <small style="color: #64748b;">ID: ${user.id}</small>
                            </div>
                        </td>
                        <td>
                            <a href="mailto:${user.email}" style="color: var(--primary); text-decoration: none; font-weight: 500;">${user.email}</a>
                        </td>
                        <td>
                            ${user.phone ? `<a href="tel:${user.phone}" style="color: var(--primary); text-decoration: none; font-weight: 500;">${user.phone}</a>` : '<em style="color: #94a3b8;">Not provided</em>'}
                        </td>
                        <td style="font-weight: 500;">${new Date(user.registrationDate).toLocaleDateString()}</td>
                        <td>
                            <strong style="color: var(--primary);">${userBookings.length}</strong><br>
                            <small style="color: var(--success); font-weight: 600;">KSH ${totalSpent.toLocaleString()} spent</small>
                        </td>
                        <td>
                            <span class="status-badge status-confirmed">
                                <i class="fas fa-check-circle"></i> Active
                            </span>
                        </td>
                    </tr>
                `;
            });
            
            tbody.innerHTML = html;
        }

        function updateAnalytics() {
            const totalUsersEl = document.getElementById('totalUsers');
            const totalActivitiesEl = document.getElementById('totalActivities');
            const totalBookingsEl = document.getElementById('totalBookings');
            const pendingBookingsEl = document.getElementById('pendingBookings');
            const confirmedBookingsEl = document.getElementById('confirmedBookings');
            const totalRevenueEl = document.getElementById('totalRevenue');

            if (totalUsersEl) totalUsersEl.textContent = users.length;
            if (totalActivitiesEl) totalActivitiesEl.textContent = activities.length;
            if (totalBookingsEl) totalBookingsEl.textContent = bookings.length;
            if (pendingBookingsEl) pendingBookingsEl.textContent = bookings.filter(b => b.status === 'Pending').length;
            if (confirmedBookingsEl) confirmedBookingsEl.textContent = bookings.filter(b => b.status === 'Confirmed').length;
            
            // Calculate total revenue
            const revenue = bookings.reduce((sum, booking) => {
                if (booking.status === 'Confirmed') {
                    const activity = activities.find(a => a.name === booking.tour);
                    return sum + (activity ? parseInt(activity.price) * booking.groupSize : 0);
                }
                return sum;
            }, 0);
            
            if (totalRevenueEl) totalRevenueEl.textContent = `KSH ${revenue.toLocaleString()}`;
        }

        // Enhanced Utility Functions
        // Add this with your other utility functions
function generateTicket(booking) {
    const activity = activities.find(a => a.name === booking.tour);
    const ticketDate = new Date(booking.travelDate);
    
    // Create a simple QR code (in a real app, you would generate a proper QR code)
    const qrCodeSVG = `
        <svg width="150" height="150" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" fill="#ffffff"/>
            <path d="M0 0h4v4H0zm8 0h4v4H8zm8 0h4v4h-4zm8 0h4v4h-4zM0 8h4v4H0zm8 8h4v4H8zm8-8h4v4h-4zm8 0h4v4h-4zM0 16h4v4H0zm8 0h4v4H8zm16 0h4v4h-4zM0 24h4v4H0zm8 0h4v4H8zm8 0h4v4h-4zm8 0h4v4h-4zM16 8h4v4h-4zm0 16h4v4h-4zM24 8h4v4h-4zm-8 8h4v4h-4z" fill="#000000"/>
        </svg>
    `;

    const ticketHTML = `
        <div class="ticket">
            <div class="ticket-header">
                <h3>Zetu Adventures</h3>
                <p>Your Adventure Ticket</p>
            </div>
            
            <div class="ticket-body">
                <div>
                    <div class="ticket-info">
                        <h4>Booking Reference</h4>
                        <p>#${booking.id}</p>
                    </div>
                    
                    <div class="ticket-info">
                        <h4>Adventure</h4>
                        <p>${booking.tour}</p>
                    </div>
                    
                    <div class="ticket-info">
                        <h4>Date</h4>
                        <p>${ticketDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</p>
                    </div>
                    
                    <div class="ticket-info">
                        <h4>Travelers</h4>
                        <p>${booking.groupSize} ${booking.groupSize > 1 ? 'persons' : 'person'}</p>
                    </div>
                </div>
                
                <div class="ticket-qr">
                    ${qrCodeSVG}
                </div>
            </div>
            
            <div class="ticket-info">
                <h4>Customer</h4>
                <p>${booking.userName}</p>
            </div>
            
            <div class="ticket-footer">
                <p>Present this ticket at the start of your adventure</p>
                <small>Booking confirmed on ${new Date(booking.bookingDate).toLocaleDateString()}</small>
            </div>
        </div>
    `;

    return ticketHTML;
}

function downloadTicket(bookingId) {
    const booking = bookings.find(b => b.id == bookingId);
    if (!booking) return;

    const ticketHTML = generateTicket(booking);
    
    // Create a Blob with the ticket HTML
    const blob = new Blob([ticketHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = `Zetu-Adventures-Ticket-${booking.id}.html`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}
        function handleImageUpload(event, previewId) {
            const file = event.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    showNotification('Image size should be less than 5MB', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById(previewId);
                    preview.src = e.target.result;
                    preview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        }

        function saveToStorage() {
            try {
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('bookings', JSON.stringify(bookings));
                localStorage.setItem('activities', JSON.stringify(activities));
                localStorage.setItem('events', JSON.stringify(events));
                if (currentUser) {
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                showNotification('Error saving data. Please try again.', 'error');
            }
        }

        function showNotification(message, type = 'info') {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notif => notif.remove());
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i> 
                ${message}
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after delay
            setTimeout(() => {
                notification.style.transform = 'translateX(500px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 400);
            }, 5000);
        }

        function loadDemoData() {
            // Load saved data from localStorage
            const savedUsers = localStorage.getItem('users');
            const savedBookings = localStorage.getItem('bookings');
            const savedActivities = localStorage.getItem('activities');
            const savedEvents = localStorage.getItem('events');

            if (savedUsers) {
                users = JSON.parse(savedUsers);
            } else {
                // Enhanced demo users
                users = [
                    {
                        id: 1,
                        name: 'Sarah Johnson',
                        email: 'sarah@example.com',
                        phone: '+254712345678',
                        password: 'password123',
                        registrationDate: new Date('2024-11-15').toISOString(),
                        emergencyContact: 'Mike Johnson - +254723456789',
                        status: 'active'
                    },
                    {
                        id: 2,
                        name: 'David Kimani',
                        email: 'david@example.com',
                        phone: '+254734567890',
                        password: 'password123',
                        registrationDate: new Date('2024-12-05').toISOString(),
                        emergencyContact: 'Grace Kimani - +254745678901',
                        status: 'active'
                    },
                    {
                        id: 3,
                        name: 'Maria Rodriguez',
                        email: 'maria@example.com',
                        phone: '+254756123890',
                        password: 'password123',
                        registrationDate: new Date('2024-12-20').toISOString(),
                        emergencyContact: 'Carlos Rodriguez - +254767234901',
                        status: 'active'
                    }
                ];
            }

            if (savedActivities) {
                activities = JSON.parse(savedActivities);
            } else {
                // Enhanced demo activities with Kenya theme
                activities = [
                    {
                        id: 1,
                        name: 'Mount Kenya Summit Adventure',
                        description: 'Embark on an epic 5-day journey to conquer Kenya\'s highest peak. Experience diverse ecosystems, breathtaking landscapes, and the ultimate challenge of reaching Point Lenana at 4,985m. This adventure includes acclimatization hikes, technical climbing sections, and stunning sunrise views from Africa\'s second-highest summit.',
                        price: 45000,
                        duration: '5 days',
                        features: 'Professional Mountain Guide, All Meals, Camping Gear, Park Fees, Porter Service',
                        imageUrl: null,
                        createdAt: new Date('2024-01-01').toISOString()
                    },
                    {
                        id: 2,
                        name: 'Maasai Mara Big Five Safari',
                        description: 'Witness the incredible Great Migration and encounter the legendary Big Five in Kenya\'s most famous game reserve. Three days of pure wildlife adventure with luxury tented accommodation, game drives during golden hours, and cultural interactions with the Maasai community.',
                        price: 65000,
                        duration: '3 days',
                        features: 'Luxury Tented Camp, All Game Drives, Cultural Village Visit, All Meals, 4WD Safari Vehicle',
                        imageUrl: null,
                        createdAt: new Date('2024-01-01').toISOString()
                    },
                    {
                        id: 3,
                        name: 'Diani Beach Paradise Escape',
                        description: 'Relax on pristine white sandy beaches of Diani and explore the rich Swahili cultural heritage of the Kenyan coast. Perfect blend of adventure and relaxation with dhow sailing, snorkeling in coral reefs, and exploring historic Fort Jesus in Mombasa.',
                        price: 35000,
                        duration: '4 days',
                        features: 'Beachfront Resort, Water Sports, Cultural Tours, Seafood Dinners, Airport Transfers',
                        imageUrl: null,
                        createdAt: new Date('2024-01-01').toISOString()
                    },
                    {
                        id: 4,
                        name: 'Samburu Wilderness Safari',
                        description: 'Discover the unique wildlife of northern Kenya and immerse yourself in authentic Samburu culture. See rare species like Grevy\'s zebra, reticulated giraffe, and Somali ostrich in this semi-arid landscape dotted with doum palms and crossed by the Ewaso Nyiro River.',
                        price: 55000,
                        duration: '4 days',
                        features: 'Cultural Village Visits, Specialized Game Drives, Traditional Meals, Local Samburu Guides, River Walks',
                        imageUrl: null,
                        createdAt: new Date('2024-01-01').toISOString()
                    },
                    {
                        id: 5,
                        name: 'Lake Nakuru Flamingo Spectacle',
                        description: 'Experience the pink paradise of Lake Nakuru, famous for its millions of flamingos creating a stunning pink carpet on the alkaline lake. Combine this with rhino tracking in the national park and visits to nearby hot springs and waterfalls.',
                        price: 28000,
                        duration: '2 days',
                        features: 'Rhino Sanctuary Visit, Bird Watching, Hot Springs, Lodge Accommodation, Nature Walks',
                        imageUrl: null,
                        createdAt: new Date('2024-01-01').toISOString()
                    },
                    {
                        id: 6,
                        name: 'Aberdare Forest Adventure',
                        description: 'Explore the mystical Aberdare Mountains with its dense forests, waterfalls, and unique wildlife. Stay in the famous Treetops Lodge and experience night game viewing from elevated platforms while elephants and other animals visit the waterholes below.',
                        price: 42000,
                        duration: '3 days',
                        features: 'Treetops Lodge, Night Game Viewing, Forest Walks, Waterfall Visits, Mountain Hiking',
                        imageUrl: null,
                        createdAt: new Date('2024-01-01').toISOString()
                    }
                ];
            }

            if (savedEvents) {
                events = JSON.parse(savedEvents);
            } else {
                // Enhanced demo events
                const today = new Date();
                events = [
                    {
                        id: 1,
                        title: 'Mount Kenya Group Expedition',
                        description: 'Join our guided group for an unforgettable mountain adventure. Perfect for solo travelers looking to make new friends!',
                        date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        activityId: 1,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        title: 'Great Migration Safari Special',
                        description: 'Special pricing for witnessing the Great Migration in Maasai Mara. Limited spots available!',
                        date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        activityId: 2,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 3,
                        title: 'Wildlife Photography Workshop',
                        description: 'Learn wildlife photography with professional instructors in Samburu National Reserve.',
                        date: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        activityId: 4,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 4,
                        title: 'Flamingo Festival Weekend',
                        description: 'Special weekend dedicated to flamingo watching and bird photography at Lake Nakuru.',
                        date: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        activityId: 5,
                        createdAt: new Date().toISOString()
                    }
                ];
            }

            if (savedBookings) {
                bookings = JSON.parse(savedBookings);
            } else {
                // Enhanced demo bookings
                bookings = [
                    {
                        id: 1001,
                        userId: 1,
                        userName: 'Sarah Johnson',
                        userEmail: 'sarah@example.com',
                        tour: 'Mount Kenya Summit Adventure',
                        travelDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        groupSize: 2,
                        paymentCode: 'QJKL12345XYZ',
                        specialRequests: 'Vegetarian meals for both travelers. One traveler has mild altitude sensitivity.',
                        status: 'Confirmed',
                        bookingDate: new Date('2024-12-01').toISOString()
                    },
                    {
                        id: 1002,
                        userId: 2,
                        userName: 'David Kimani',
                        userEmail: 'david@example.com',
                        tour: 'Maasai Mara Big Five Safari',
                        travelDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        groupSize: 4,
                        paymentCode: 'MNOP67890ABC',
                        specialRequests: 'Family group with children ages 8 and 12. Need family-friendly accommodation.',
                        status: 'Pending',
                        bookingDate: new Date('2024-12-15').toISOString()
                    },
                    {
                        id: 1003,
                        userId: 3,
                        userName: 'Maria Rodriguez',
                        userEmail: 'maria@example.com',
                        tour: 'Diani Beach Paradise Escape',
                        travelDate: new Date(today.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        groupSize: 1,
                        paymentCode: 'WXYZ98765DEF',
                        specialRequests: 'Solo female traveler. Prefer cultural experiences and photography opportunities.',
                        status: 'Confirmed',
                        bookingDate: new Date('2024-12-20').toISOString()
                    }
                ];
            }

            saveToStorage();
        }

        // Enhanced Event Listeners
        window.onclick = function(event) {
            const modals = document.getElementsByClassName('modal');
            for (let modal of modals) {
                if (event.target === modal) {
                    closeModal(modal.id);
                }
            }
        };

        // Enhanced drag and drop for image upload
        document.addEventListener('dragover', function(e) {
            const uploadAreas = document.querySelectorAll('.image-upload');
            uploadAreas.forEach(area => {
                if (area.contains(e.target)) {
                    e.preventDefault();
                    area.classList.add('dragover');
                }
            });
        });

        document.addEventListener('dragleave', function(e) {
            const uploadAreas = document.querySelectorAll('.image-upload');
            uploadAreas.forEach(area => {
                if (!area.contains(e.relatedTarget)) {
                    area.classList.remove('dragover');
                }
            });
        });

        document.addEventListener('drop', function(e) {
            e.preventDefault();
            const uploadAreas = document.querySelectorAll('.image-upload');
            uploadAreas.forEach(area => {
                area.classList.remove('dragover');
                if (area.contains(e.target)) {
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        const fileInput = area.querySelector('input[type="file"]');
                        fileInput.files = files;
                        fileInput.dispatchEvent(new Event('change'));
                    }
                }
            });
        });

        // Smooth scrolling for anchor links
        document.addEventListener('click', function(e) {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });

        // Auto-refresh calendar and hero stats
        setInterval(generateCalendar, 60000);
        setInterval(updateHeroStats, 3000);

        function updateHeroStats() {
            const totalToursEl = document.getElementById('heroTotalTours');
            const happyCustomersEl = document.getElementById('heroHappyCustomers');
            
            if (totalToursEl) totalToursEl.textContent = `${activities.length}+`;
            if (happyCustomersEl) {
                const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
                happyCustomersEl.textContent = `${Math.max(500, 500 + confirmedBookings * 10)}+`;
            }
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // ESC to close modals
            if (e.key === 'Escape') {
                const openModals = document.querySelectorAll('.modal[style*="block"]');
                openModals.forEach(modal => {
                    closeModal(modal.id);
                });
            }
        });