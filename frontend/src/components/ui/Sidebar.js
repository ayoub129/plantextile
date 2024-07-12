// import the Link Icon
import LinkIcon from './LinkIcon'

const Sidebar = ({ sidebar }) => {
   // get the role from localStorage
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  // check base on the role what navigation bar you have 
  const links = {
    'developer': [
      { link: '/dashboard', text: 'Dashboard' },
      { link: '/products', text: 'Products' },
      { link: '/users', text: 'Users' },
      { link: '/planning', text: 'Planification' },
      { link: '/addconstantSystem', text: 'Add System Constant' },
      { link: '/direct', text: 'Direct Effective Standard' },
      { link: '/indirect', text: 'InDirect Effective Standard' },
      { link: '/chains', text: 'Chains' },
      { link: '/real-direct', text: 'Real Direct Effective' },
      { link: '/real-indirect', text: 'Real InDirect Effective' },
      { link: '/coupe', text: 'La Coupe' },
      { link: '/production', text: 'Production' },
      { link: '/repassage', text: 'Repassage' },
      { link: '/control-final', text: 'Control Final' },
      { link: '/magasin', text: 'Magasin' },
      { link: `/profile/${userId}`, text: 'Profile' },
      { link: '/export', text: 'Export' },
    ],
    'superadmin': [
      { link: '/dashboard', text: 'Dashboard' },
      { link: '/products', text: 'Products' },
      { link: '/users', text: 'Users' },
      { link: '/planning', text: 'Planification' },
      { link: '/addconstantSystem', text: 'Add System Constant' },
      { link: '/direct', text: 'Direct Effective Standard' },
      { link: '/indirect', text: 'InDirect Effective Standard' },
      { link: '/chains', text: 'Chains' },
      { link: '/real-direct', text: 'Real Direct Effective' },
      { link: '/real-indirect', text: 'Real InDirect Effective' },
      { link: '/coupe', text: 'La Coupe' },
      { link: '/production', text: 'Production' },
      { link: '/repassage', text: 'Repassage' },
      { link: '/control-final', text: 'Control Final' },
      { link: '/magasin', text: 'Magasin' },
      { link: `/profile/${userId}`, text: 'Profile' },
      { link: '/export', text: 'Export' },
    ],
    'admin': [
      { link: '/dashboard', text: 'Dashboard' },
      { link: '/products', text: 'Products' },
      { link: '/users', text: 'Users' },
      { link: '/planning', text: 'Planification' },
      { link: '/addconstantSystem', text: 'Add System Constant' },
      { link: '/direct', text: 'Direct Effective Standard' },
      { link: '/indirect', text: 'InDirect Effective Standard' },
      { link: '/chains', text: 'Chains' },
      { link: '/real-direct', text: 'Real Direct Effective' },
      { link: '/real-indirect', text: 'Real InDirect Effective' },
      { link: '/coupe', text: 'La Coupe' },
      { link: '/production', text: 'Production' },
      { link: '/repassage', text: 'Repassage' },
      { link: '/control-final', text: 'Control Final' },
      { link: '/magasin', text: 'Magasin' },
      { link: `/profile/${userId}`, text: 'Profile' },
      { link: '/export', text: 'Export' },
    ],
    'Logistique': [
      { link: '/products', text: 'Products' },
      { link: '/addproducts', text: 'Add Product' },
      { link: `/profile/${userId}`, text: 'Profile' },
    ],
    'Method': [
      { link: '/planning', text: 'Planification' },
      { link: '/direct', text: 'Direct Effective Standard' },
      { link: '/indirect', text: 'InDirect Effective Standard' },
      { link: `/profile/${userId}`, text: 'Profile' },
    ],
    'HR': [
      { link: '/users', text: 'Users' },
      { link: '/chains', text: 'Chains' },
      { link: '/real-direct', text: 'Real Direct Effective' },
      { link: '/real-indirect', text: 'Real InDirect Effective' },
      { link: `/profile/${userId}`, text: 'Profile' },
    ],
    'production_coupe': [
      { link: '/coupe', text: 'La Coupe' },
      { link: `/profile/${userId}`, text: 'Profile' },
    ],
    'production_repassage' : [
      { link: '/repassage', text: 'Repassage' },
      { link: `/profile/${userId}`, text: 'Profile' },
    ],
    'production_chain' : [
      { link: '/production', text: 'Production' },
      { link: `/profile/${userId}`, text: 'Profile' },
    ],
    'production_control' : [
      { link: '/control-final', text: 'Control Final' },
      { link: `/profile/${userId}`, text: 'Profile' },
      { link: '/export', text: 'Export' },
    ],
    'production_magasin' : [
      { link: '/magasin', text: 'Magasin' },
      { link: `/profile/${userId}`, text: 'Profile' },
      { link: '/export', text: 'Export' },
    ]
  };

  // render the links base on the logged in user
  const renderLinks = () => {
    const roleLinks = links[role] || [];
    return roleLinks.map((link, index) => (
      <LinkIcon key={index} link={link.link} text={link.text} />
    ));
  };

  return (
<div className="w-1/2 md:w-1/6 mt-20 bg-white fixed h-[calc(100vh-5rem)] pb-[5rem] overflow-y-auto 
              ${sidebar ? 'left-0 shadow-lg shadow-gray-500' : 'left-[-200%]'} md:left-0">
      {renderLinks()}
    </div>
  );
};

export default Sidebar;
