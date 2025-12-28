import { useState } from 'react';
import { NavbarDashboard } from '../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../components/Dashboard/Sidebar/SidebarDashboard';
import { TabsNavigation } from '../../components/Dashboard/Tabs/TabsNavigation';
import { CreatorGrid } from '../../components/Dashboard/CreatorCard/CreatorGrid';
import { useDashboard } from '../../shared/hooks/useDashboard';

export const DashboardEspectadorPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState<'nuevas' | 'destacadas' | null>(null);
  
  const {
    activeTab,
    creators,
    loading,
    handleTabChange,
    handleCreatorClick,
    handleLike,
  } = useDashboard();

  // Filtrar creators según quick filter
  const filteredCreators = quickFilter
    ? creators.filter(c => {
        if (quickFilter === 'nuevas') {
          const dias = Math.floor((Date.now() - new Date(c.fechaRegistro || 0).getTime()) / (1000 * 60 * 60 * 24));
          return dias <= 7;
        }
        if (quickFilter === 'destacadas') {
          return c.isVerified && c.likes > 1000;
        }
        return true;
      })
    : creators;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <NavbarDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationsCount={5}
        messagesCount={3}
      />

      {/* Sidebar */}
      <SidebarDashboard
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Explorar Creadoras
            </h1>
            <p className="text-gray-600">
              Descubre contenido exclusivo de las mejores creadoras del Perú
            </p>
          </div>

          {/* Tabs + Quick Filters */}
          <div className="mb-6">
            <TabsNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              activeQuickFilter={quickFilter}
              onQuickFilterChange={setQuickFilter}
            />
          </div>

          {/* Grid */}
          <CreatorGrid
            creators={filteredCreators}
            loading={loading}
            onCreatorClick={handleCreatorClick}
            onLike={handleLike}
          />

          {/* Load More */}
          {!loading && filteredCreators.length > 0 && (
            <div className="text-center mt-8">
              <button className="px-8 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-pink-500 hover:text-pink-600 transition">
                Cargar más
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};