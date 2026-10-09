# Container Section (legacy backup)

Moved here from frontend/src/pages/ContainerSection when the /container-section page was removed (routes now redirect to /containers).
Kept for reference only, nothing in the app imports this folder.

- TrackingModal.jsx: modal with two tabs. "Container Booking" (POST /api/bookings/, ports + start/end dates) and "Track by Shipment No" (GET /api/shipments/track/?tracking_no=...). Both backend endpoints still exist.
- ContainerPage.jsx opened the modal from ?action=book or the Book button.
- ContainerShowcase.jsx, 3d/ContainerModel.jsx, FeatureCards, HeroSection, StatsBar etc. were the page's own components.
