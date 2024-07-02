import React from 'react'
import LinkIcon from './LinkIcon'

const Sidebar = ({ sidebar }) => {
  const role = localStorage.getItem('role'); // Assuming the role is stored in localStorage

  const links = {
    'developer': [
      { link: '/dashboard', text: 'Dashboard' },
      { link: '/products', text: 'Products' },
      { link: '/users', text: 'Users' },
      { link: '/planning', text: 'Planification' },
      { link: '/addconstantSystem', text: 'Add System Constant' },
      { link: '/direct', text: 'Direct Effective Standard' },
      { link: '/indirect', text: 'InDirect Effective Standard' },
      { link: '/posts', text: 'Add posts' },
      { link: '/chains', text: 'Chains' },
      { link: '/real-direct', text: 'Real Direct Effective' },
      { link: '/real-indirect', text: 'Real InDirect Effective' },
      { link: '/coupe', text: 'La Coupe' },
      { link: '/repassage', text: 'Repassage' },
      { link: '/production', text: 'Production' },
      { link: '/export', text: 'Export' },
      { link: '/result', text: 'Result' },
      { link: '/export', text: 'Export' },
      { link: '/control-final', text: 'Control Final' },
    ],
    'super-admin': [
      { link: '/dashboard', text: 'Dashboard' },
      { link: '/products', text: 'Products' },
      { link: '/users', text: 'Users' },
      { link: '/planning', text: 'Planification' },
      { link: '/addconstantSystem', text: 'Add System Constant' },
      { link: '/direct', text: 'Direct Effective Standard' },
      { link: '/indirect', text: 'InDirect Effective Standard' },
      { link: '/posts', text: 'Add posts' },
      { link: '/chains', text: 'Chains' },
      { link: '/real-direct', text: 'Real Direct Effective' },
      { link: '/real-indirect', text: 'Real InDirect Effective' },
      { link: '/coupe', text: 'La Coupe' },
      { link: '/repassage', text: 'Repassage' },
      { link: '/production', text: 'Production' },
      { link: '/export', text: 'Export' },
      { link: '/result', text: 'Result' },
      { link: '/export', text: 'Export' },
      { link: '/control-final', text: 'Control Final' },
    ],
    'admin': [
      { link: '/dashboard', text: 'Dashboard' },
      { link: '/products', text: 'Products' },
      { link: '/users', text: 'Users' },
      { link: '/planning', text: 'Planification' },
      { link: '/addconstantSystem', text: 'Add System Constant' },
      { link: '/direct', text: 'Direct Effective Standard' },
      { link: '/indirect', text: 'InDirect Effective Standard' },
      { link: '/posts', text: 'Add posts' },
      { link: '/chains', text: 'Chains' },
      { link: '/real-direct', text: 'Real Direct Effective' },
      { link: '/real-indirect', text: 'Real InDirect Effective' },
      { link: '/coupe', text: 'La Coupe' },
      { link: '/repassage', text: 'Repassage' },
      { link: '/production', text: 'Production' },
      { link: '/export', text: 'Export' },
      { link: '/result', text: 'Result' },
      { link: '/export', text: 'Export' },
      { link: '/control-final', text: 'Control Final' },
    ],
    'Logistique': [
      { link: '/products', text: 'Products' },
      { link: '/result', text: 'Result' },
      { link: '/export', text: 'Export' },
    ],
    'Method': [
      { link: '/planning', text: 'Planification' },
      { link: '/direct', text: 'Direct Effective Standard' },
      { link: '/indirect', text: 'InDirect Effective Standard' },
      { link: '/posts', text: 'Add posts' },
      { link: '/result', text: 'Result' },
      { link: '/export', text: 'Export' },
    ],
    'RH': [
      { link: '/users', text: 'Users' },
      { link: '/chains', text: 'Chains' },
      { link: '/real-direct', text: 'Real Direct Effective' },
      { link: '/real-indirect', text: 'Real InDirect Effective' },
      { link: '/result', text: 'Result' },
      { link: '/export', text: 'Export' },
    ],
    'Production-coupe': [
      { link: '/coupe', text: 'La Coupe' },
      { link: '/result', text: 'Result' },
      { link: '/export', text: 'Export' },
    ],
    'Production-repassage' : [
      { link: '/repassage', text: 'Repassage' },
      { link: '/result', text: 'Result' },
      { link: '/export', text: 'Export' },
    ],
    'Production' : [
      { link: '/production', text: 'Production' },
      { link: '/result', text: 'Result' },
      { link: '/export', text: 'Export' },
    ],
    'Production-control-final' : [
      { link: '/control-final', text: 'Control Final' },
      { link: '/result', text: 'Result' },
      { link: '/export', text: 'Export' },
    ]
  };

  const renderLinks = () => {
    const roleLinks = links[role] || [];
    return roleLinks.map((link, index) => (
      <LinkIcon key={index} link={link.link} text={link.text} />
    ));
  };

  return (
    <div className={`w-1/2 md:w-1/6 mt-20 bg-white fixed ${sidebar ? 'left-0 shadow-lg shadow-gray-500' : 'left-[-200%]'} md:left-0 pb-[5rem] md:h-full overflow-y-auto`}>
      {renderLinks()}
    </div>
  );
};

export default Sidebar;
