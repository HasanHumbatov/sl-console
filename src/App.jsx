import './App.css';
import { useState } from 'react';
import {
  SquaresPlusIcon,
  TagIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import AppList from './components/AppList';
import BaselineApplicationTags from './components/BaselineApplicationTags';
import IgnoreList from './components/IgnoreList';
import BranchBuilds from './components/BranchBuilds';
import TGAreport from './components/TGAreport';
import logo from '../src/assets/images/logo.png';

const App = () => {
  // Set 'AppList' as the default active component
  const [activeComponent, setActiveComponent] = useState('AppList');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'AppList':
        return <AppList />;
      case 'IgnoreList':
        return <IgnoreList />;
      case 'BaselineApplicationTags':
        return <BaselineApplicationTags />;
      case 'BranchBuilds':
        return <BranchBuilds />;
      case 'TGAreport':
        return <TGAreport />;
      default:
        return null;
    }
  };

  return (
    <div className='flex h-screen'>
      {/* Left Sidebar */}
      <nav className='w-1/6 bg-gray-800 text-white flex flex-col space-y-4 p-6 h-full'>
        <img src={logo} alt='logo' className='w-40 mt-4 mb-8 mx-auto' />
        <button
          onClick={() => setActiveComponent('AppList')}
          className={`flex items-center text-left py-2 px-4 rounded w-full hover:bg-gray-700 ${
            activeComponent === 'AppList' ? 'bg-gray-600' : ''
          }`}
        >
          <SquaresPlusIcon className='h-5 w-5 mr-5' /> {/* Icon */}
          Live Agents
        </button>
        <button
          onClick={() => setActiveComponent('BaselineApplicationTags')}
          className={`flex items-center text-left py-2 px-4 rounded w-full hover:bg-gray-700 ${
            activeComponent === 'BaselineApplicationTags' ? 'bg-gray-600' : ''
          }`}
        >
          <TagIcon className='h-5 w-5 mr-5' /> {/* Icon */}
          Baseline Application Tags
        </button>
        <button
          onClick={() => setActiveComponent('BranchBuilds')}
          className={`flex items-center text-left py-2 px-4 rounded w-full hover:bg-gray-700 ${
            activeComponent === 'BranchBuilds' ? 'bg-gray-600' : ''
          }`}
        >
          <DocumentArrowDownIcon className='h-5 w-5 mr-5' /> {/* Icon */}
          Service Branch Builds
        </button>
        <button
          onClick={() => setActiveComponent('IgnoreList')}
          className={`flex items-center text-left py-2 px-4 rounded w-full hover:bg-gray-700 ${
            activeComponent === 'IgnoreList' ? 'bg-gray-600' : ''
          }`}
        >
          <XCircleIcon className='h-5 w-5 mr-5' /> {/* Icon */}
          Service Ignores
        </button>
        <button
          onClick={() => setActiveComponent('TGAreport')}
          className={`flex items-center text-left py-2 px-4 rounded w-full hover:bg-gray-700 ${
            activeComponent === 'TGAreport' ? 'bg-gray-600' : ''
          }`}
        >
          <DocumentCheckIcon className='h-5 w-5 mr-5' /> {/* Icon */}
          TGA Report Search
        </button>
      </nav>

      {/* Main Content */}
      <div className='flex-1 p-6 bg-gray-100 overflow-auto'>
        {renderComponent()}
      </div>
    </div>
  );
};

export default App;
