import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import DeliveryAssignment from './pages/DeliveryAssignment';
import DeliveryPersonnel from './pages/DeliveryPersonnel';
import Inventory from './pages/Inventory';
import WalletDues from './pages/WalletDues';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import RouteOverview from './pages/RouteOverview';
import Pricing from './pages/Pricing';
import HolidayCalendar from './pages/HolidayCalendar';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"                 element={<Dashboard />} />
          <Route path="/orders"           element={<Orders />} />
          <Route path="/customers"        element={<Customers />} />
          <Route path="/assignment"       element={<DeliveryAssignment />} />
          <Route path="/personnel"        element={<DeliveryPersonnel />} />
          <Route path="/inventory"        element={<Inventory />} />
          <Route path="/wallet"           element={<WalletDues />} />
          <Route path="/analytics"        element={<Analytics />} />
          <Route path="/notifications"    element={<Notifications />} />
          <Route path="/route-overview"   element={<RouteOverview />} />
          <Route path="/pricing"          element={<Pricing />} />
          <Route path="/calendar"         element={<HolidayCalendar />} />
          <Route path="*"                 element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
