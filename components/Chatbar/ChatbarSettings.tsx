import { SupportedExportFormats } from '@/types/export';
import { PluginKey } from '@/types/plugin';
import { IconFileExport, IconMoon, IconSun, IconLink } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { FC, use, useEffect } from 'react';
import { Import } from '../Settings/Import';
import { Key } from '../Settings/Key';
import { SidebarButton } from '../Sidebar/SidebarButton';
import { ClearConversations } from './ClearConversations';
import { useState } from 'react';
import { Addy } from '@/types/opensea';

interface Window {
  ethereum: any
}

interface Props {
  lightMode: 'light' | 'dark';
  conversationsCount: number;
  onToggleLightMode: (mode: 'light' | 'dark') => void;
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (data: SupportedExportFormats) => void;
  
}

export  const ChatbarSettings: FC<Props> = ({
  lightMode,
  conversationsCount,
  onToggleLightMode,
  onClearConversations,
  onExportConversations,
  onImportConversations,
}) => {
  const { t } = useTranslation('sidebar');

  const [addy,setAddy] = useState(null)
  const [holder,setHolder] = useState(false)

  useEffect(() => {
    if (holder === true){
      localStorage.setItem('Holder',true)
    }
  },[holder])
  

  useEffect(() => {
    if (addy !== null){
    const fetchData = async () => {
      try {
        const body = JSON.stringify(addy);
        const response = await fetch('api/opensea/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body
        });
          
        if (response.ok) {
          const data = await response.json();
          if (data.length >= 1 ){
            setHolder(true)
            
          }
        } else {
          console.error('Request failed with status:', response.status);
        }
        setAddy(null)
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
  
    fetchData();
  }}, [addy]);

  const handleConnect = (addy: Addy) => {
    if(window.ethereum) {
        window.ethereum.request({method: 'eth_requestAccounts'}).then(res => {
            setAddy(res[0])
            })
        }
    else{
          alert("install metamask extension!!")
    }}

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversationsCount > 0 ? (
        <ClearConversations onClearConversations={onClearConversations} />
      ) : null}

      <Import onImport={onImportConversations} />

      <SidebarButton
        text={t('Export data')}
        icon={<IconFileExport size={18} />}
        onClick={() => onExportConversations()}
      />

      <SidebarButton
        text={lightMode === 'light' ? t('Dark mode') : t('Light mode')}
        icon={
          lightMode === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />
        }
        onClick={() =>
          onToggleLightMode(lightMode === 'light' ? 'dark' : 'light')
        }
      />
      <SidebarButton
        text={t('Connect')}
        onClick={handleConnect}
        icon={<IconLink size={18}></IconLink>}
        
         />
        
      
    </div>
  );
};
