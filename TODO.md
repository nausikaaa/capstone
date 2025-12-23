# Property Tracker - Remaining Tasks

## Phase 1: Core Features (In Progress)

### ✅ Completed
- [x] Property intake (paste URL, fetch data, create record)
- [x] Personal notes on properties
- [x] Star rating system (1-5)
- [x] Stage management (New → Scheduled → Visited → Archived)
- [x] Schedule visit with date picker
- [x] Mark as visited with date
- [x] Reschedule/cancel visits
- [x] Archive/unarchive properties
- [x] Kanban board layout with 4 columns
- [x] Property tiles with compact design
- [x] Stage filtering via columns
- [x] Supabase authentication
- [x] Database schema with RLS policies
- [x] Window analysis using Gemini Vision API
- [x] AI analysis results stored in database
- [x] Bioclimatic scoring for properties

### ⏳ In Progress
- [x] Fix window analysis modal flickering (using portal)
- [x] Verify Gemini API model integration
- [x] Design iteration (colors, responsiveness, drag&drop)
- [ ] Create first eval for the bioclimatic analysis
- [ ] Store previous bioclimatic analysis

## Phase 2: Enhanced Property Management

### Property Data
- [ ] **Enthusiasm score UI** - Add slider/input for 1-10 enthusiasm rating (field exists in DB)
- [ ] **Manual data editing** - Allow users to add/edit missing property details (sqm², bedrooms, etc.)
- [ ] **Edit scraped data** - UI to update incorrect/missing fields from Apify scrape
- [ ] **Property comparison view** - Side-by-side comparison of 2-3 properties
- [ ] **Duplicate detection** - Warn when adding same property URL twice

### Photo Management
- [ ] **User photo upload** - Allow uploading photos taken during visits
- [ ] **Photo gallery** - View all photos for a property
- [ ] **Photo captions** - Add notes to individual photos
- [ ] **Photo timestamps** - Automatically timestamp uploaded photos
- [ ] **Photo storage** - Integrate with Supabase Storage for photo uploads
- [ ] **Photo analysis** - Run window analysis on user-uploaded photos

## Phase 3: Research & Decision Support

### Pre-Visit Research
- [ ] **Property research cards** - "What to look for" based on property type
- [ ] **Custom checklists** - Create visit checklists for scheduled properties
- [ ] **Questions to ask** - AI-generated questions based on property details
- [ ] **Neighborhood analysis** - Integrate location/neighborhood data
- [ ] **Comparison to similar properties** - Show how this property compares

### Post-Visit Analysis
- [ ] **Visit notes template** - Structured form for post-visit notes
- [ ] **Pros/cons list** - Quick capture of good/bad points
- [ ] **Deal-breakers tracking** - Flag critical issues found during visit
- [ ] **Visit summary** - Auto-generate visit summary from notes

## Phase 4: AI-Powered Insights

### Analysis Features
- [ ] **Comprehensive bioclimatic analysis** - Beyond just windows
- [ ] **Energy efficiency scoring** - Overall property energy rating
- [ ] **Renovation cost estimates** - AI estimates for identified improvements
- [ ] **Living comfort analysis** - Temperature, humidity, light quality predictions
- [ ] **Orientation analysis** - Sun exposure throughout the day
- [ ] **Noise analysis** - Based on location/photos (street, neighbors)

### Ranking & Recommendations
- [ ] **Comparative ranking** - Auto-rank properties based on user interactions
- [ ] **Smart recommendations** - Suggest which properties to revisit
- [ ] **Priority scoring** - Help identify which properties are best matches
- [ ] **Decision timeline** - Track how preferences evolve over time
- [ ] **Missing criteria detection** - Identify what matters based on user behavior

## Phase 5: Collaboration & Sharing

### Multi-User Support
- [ ] **Shared properties** - Share property with partner/family
- [ ] **Comments & discussions** - Discuss properties with others
- [ ] **Voting system** - Each user rates/votes on properties
- [ ] **Shared checklists** - Collaborative visit checklists
- [ ] **Activity feed** - See what others have added/updated

## Phase 6: Advanced Features

### Export & Reporting
- [ ] **PDF property report** - Export detailed property report
- [ ] **Comparison matrix** - Spreadsheet-style comparison export
- [ ] **Visit history** - Timeline of all property visits
- [ ] **Decision journal** - Document why properties were archived

### Integrations
- [ ] **Calendar integration** - Sync scheduled visits to calendar
- [ ] **Email notifications** - Reminders for scheduled visits
- [ ] **Map view** - Show all properties on a map
- [ ] **Route planning** - Optimize visit routes for multiple viewings
- [ ] **Mortgage calculator** - Basic affordability calculations

### Mobile & Offline
- [ ] **Mobile-responsive improvements** - Better mobile UX
- [ ] **Progressive Web App (PWA)** - Install as app on mobile
- [ ] **Offline mode** - View properties without internet
- [ ] **Photo capture** - Take photos directly in app during visits

## Technical Debt & Improvements

### Code Quality
- [ ] **TypeScript strict mode** - Enable stricter TypeScript checks
- [ ] **Error boundaries** - Better error handling in React
- [ ] **Loading states** - Better loading UI throughout app
- [ ] **Optimistic updates** - Faster UI feedback
- [ ] **Error retry logic** - Auto-retry failed API calls

### Performance
- [ ] **Image optimization** - Compress/resize scraped images
- [ ] **Lazy loading** - Load images on demand
- [ ] **Virtual scrolling** - Handle hundreds of properties
- [ ] **Caching strategy** - Cache scraped data
- [ ] **Database indexes** - Optimize query performance

### Testing
- [ ] **Unit tests** - Test core business logic
- [ ] **Integration tests** - Test API endpoints
- [ ] **E2E tests** - Test critical user flows
- [ ] **Accessibility testing** - WCAG compliance

### DevOps
- [ ] **CI/CD pipeline** - Automated testing and deployment
- [ ] **Environment management** - Staging vs production
- [ ] **Database migrations** - Automated schema updates
- [ ] **Monitoring & logging** - Track errors and performance
- [ ] **Backup strategy** - Regular database backups

## User-Requested Features
<!-- Add your custom tasks below -->

---

**Priority Key:**
- 🔴 Critical
- 🟡 High
- 🟢 Medium
- ⚪ Low
