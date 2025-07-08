# FirstCall - Emergency Services Locator

A modern, responsive web application that helps users quickly locate and access emergency services in Dhaka, Bangladesh. Built with React, TypeScript, and Leaflet maps.

![FirstCall Screenshot](https://via.placeholder.com/800x400/10b981/ffffff?text=FirstCall+Emergency+Services+Map)

## 🚨 Features

- **Real-time Emergency Services Map** - Interactive map showing hospitals, police stations, and fire stations
- **Location-based Services** - Find the closest emergency services to your current location
- **Quick Emergency Contacts** - One-click access to emergency hotlines (999)
- **Service Filtering** - Toggle different types of emergency services on/off
- **Directions Integration** - Get directions to any emergency service via Google Maps
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Live Data** - Emergency services data sourced from OpenStreetMap via Overpass API

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with OpenStreetMap tiles
- **Icons**: Lucide React
- **Data Source**: OpenStreetMap via Overpass API
- **Build Tool**: Vite
- **Deployment**: Ready for Netlify, Vercel, or any static hosting

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/firstcall-dhaka.git
cd firstcall-dhaka
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📱 Usage

1. **View Emergency Services**: The map loads with all available emergency services in Dhaka
2. **Filter Services**: Use the sidebar to toggle different service types (hospitals, police, fire stations)
3. **Find Your Location**: Click "Locate Me" to center the map on your current position
4. **Get Directions**: Click on any service marker and select "Get Directions"
5. **Emergency Calls**: Use the emergency hotline numbers at the top for immediate assistance
6. **Closest Services**: The sidebar shows the nearest service of each type when location is enabled

## 🗺️ Service Categories

- **🏥 Hospitals** - Medical emergency services and healthcare facilities
- **👮 Police Stations** - Law enforcement and security services  
- **🚒 Fire Stations** - Fire emergency and rescue services

## 🌍 Coverage Area

Currently covers Dhaka city limits with plans to expand to other major cities in Bangladesh. The application can be easily adapted for other cities worldwide by modifying the geographic bounds in the configuration.

## 🔧 Configuration

### Changing the Coverage Area

To adapt this application for another city, modify the bounds in `src/services/overpassApi.ts`:

```typescript
const CITY_BOUNDS = {
  south: YOUR_CITY_SOUTH_BOUND,
  west: YOUR_CITY_WEST_BOUND,
  north: YOUR_CITY_NORTH_BOUND,
  east: YOUR_CITY_EAST_BOUND
};
```

### Adding New Service Types

1. Add the new service category to `serviceCategories` in `src/services/overpassApi.ts`
2. Update the TypeScript types in `src/types/emergency.ts`
3. The UI will automatically adapt to show the new service type

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code style and TypeScript conventions
2. Ensure responsive design principles are maintained
3. Test on multiple devices and browsers
4. Update documentation for any new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap Contributors** - For providing the emergency services data
- **Overpass API** - For real-time data access
- **Leaflet** - For the interactive mapping functionality
- **Tailwind CSS** - For the responsive design system

## 📞 Emergency Numbers (Bangladesh)

- **Fire Service**: 999
- **Police**: 999  
- **Ambulance**: 999
- **National Emergency**: 999

## 🔮 Future Enhancements

- [ ] Offline map support
- [ ] Multi-language support (Bengali/English)
- [ ] User reviews and ratings for services
- [ ] Real-time service availability status
- [ ] Integration with local emergency dispatch systems
- [ ] Mobile app version (React Native)

## 📧 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/firstcall-dhaka/issues) on GitHub.

---

**⚠️ Disclaimer**: This application is for informational purposes only. In case of a real emergency, always call the official emergency numbers (999 in Bangladesh) immediately.