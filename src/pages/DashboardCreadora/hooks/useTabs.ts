import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type TabTypeMenu = 'inicio' | 'invitaciones' | 'resumen' |
  'contenido' | 'packs' | 'envivo' | 'mensajes' | 'donaciones' |
  'configuracion' | 'reportes';

//export type SubTabType = 'invitaciones' | 'miactividad' | 'resumen';
export type SubTabType = 'invitaciones' | 'resumen';

export const useTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = (searchParams.get('tab') as TabTypeMenu) || 'invitaciones';
  const subTabFromUrl = (searchParams.get('subtab') as SubTabType) || 'invitaciones';

  const [activeTab, setActiveTab] = useState<TabTypeMenu>(tabFromUrl);
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>(subTabFromUrl);

  useEffect(() => {
    const params: Record<string, string> = { tab: activeTab };

    if (activeTab === 'resumen' || activeTab === 'invitaciones') {
      params.subtab = activeSubTab;
    }

    setSearchParams(params, { replace: true });
  }, [activeTab, activeSubTab, setSearchParams]);

  const handleTabChange = (tab: TabTypeMenu) => {
    setActiveTab(tab);
    if (tab === 'invitaciones') {
      setActiveSubTab('invitaciones');
    } else if (tab === 'resumen') {
      setActiveSubTab('invitaciones');
    }
  };

  const handleSubTabChange = (tab: string) => {
    // if (tab === 'invitaciones' || tab === 'miactividad' || tab === 'resumen') {
    //   setActiveSubTab(tab as SubTabType);
    // }
     if (tab === 'invitaciones'  || tab === 'resumen') {
      setActiveSubTab(tab as SubTabType);
    }
  };

  return {
    activeTab,
    activeSubTab,
    handleTabChange,
    handleSubTabChange,
  };
};
