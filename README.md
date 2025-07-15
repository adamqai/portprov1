# PortPro - Port Operations Monitoring System

A comprehensive web application for monitoring port and shipping operation activities in real-time.

## 🚢 Features

- **Real-time Vessel Tracking**: Live map with vessel positions and status
- **Port Operations Dashboard**: Monitor berth utilization, cargo operations, and vessel schedules
- **Activity Monitoring**: Track loading/unloading operations, vessel arrivals/departures
- **Reporting**: Generate operational reports and analytics
- **User Management**: Role-based access control for port staff

## 🏗️ Architecture

### Frontend (Next.js 15 + TypeScript)
- **Pages**: Dashboard, Vessel Management, Operations, Reports
- **Components**: Reusable UI components with shadcn/ui
- **Hooks**: Custom hooks for data fetching and state management
- **Maps**: Interactive vessel tracking with Leaflet

### Backend (Next.js API Routes)
- **Authentication**: NextAuth.js with role-based access
- **Database**: PostgreSQL with Drizzle ORM
- **API Endpoints**: RESTful APIs for vessels, operations, berths
- **Real-time**: WebSocket support for live updates

## 📁 Project Structure

```
portprov1/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main dashboard pages
│   ├── api/               # Backend API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   ├── forms/           # Form components
│   └── maps/            # Map-related components
├── lib/                  # Utility libraries
│   ├── db/              # Database configuration
│   ├── auth/            # Authentication utilities
│   └── utils/           # Helper functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   ```bash
   # Create .env.local with your DATABASE_URL
   DATABASE_URL=postgresql://user:password@localhost:5432/portpro
   
   # Run database migrations
   npm run db:generate
   npm run db:migrate
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open http://localhost:3000
   - Login with admin credentials
   - Start monitoring port operations

## 🔧 Configuration

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/portpro
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Database Schema
- **Vessels**: Ship information, IMO numbers, specifications
- **Berths**: Port berths with capacity and status
- **Operations**: Cargo operations, loading/unloading activities
- **Users**: Staff accounts with role-based permissions

## 📊 Dashboard Features

### Main Dashboard
- Real-time vessel positions on interactive map
- Current berth utilization status
- Active operations overview
- Key performance indicators

### Vessel Management
- Add/edit vessel information
- Track vessel schedules (ETA/ETD)
- Monitor cargo operations
- View vessel history

### Operations Monitoring
- Real-time operation status
- Cargo loading/unloading progress
- Berth allocation management
- Operation scheduling

### Reports & Analytics
- Daily/weekly/monthly reports
- Performance metrics
- Export capabilities
- Historical data analysis

## 🛠️ Development

### Adding New Features
1. Create API routes in `app/api/`
2. Add components in `components/`
3. Update types in `types/`
4. Add database schema in `lib/db/schema.ts`

### Database Migrations
```bash
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations
```

### Code Quality
```bash
npm run lint         # ESLint checking
npm run build        # Production build
```

## 📈 Monitoring & Analytics

The system provides comprehensive monitoring capabilities:
- **Real-time Tracking**: Live vessel positions and status updates
- **Performance Metrics**: Berth utilization, operation efficiency
- **Alert System**: Notifications for delays, issues, or milestones
- **Historical Data**: Track trends and patterns over time

## 🔐 Security

- Role-based access control
- Secure API endpoints
- Input validation and sanitization
- Audit logging for critical operations

## 🚀 Deployment

The application is ready for deployment to:
- Vercel (recommended)
- Railway
- AWS
- Docker containers

---

**PortPro** - Streamlining port operations through intelligent monitoring and real-time insights.