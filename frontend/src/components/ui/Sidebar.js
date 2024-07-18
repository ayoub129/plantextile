import LinkIcon from "./LinkIcon";

const Sidebar = ({ sidebar }) => {
  // get the role from localStorage
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // check base on the role what navigation bar you have
  const links = {
    developer: [
      { link: "/dashboard", text: "Tableau de bord" },
      { link: "/products", text: "Produits" },
      { link: "/users", text: "Utilisateurs" },
      { link: "/planning", text: "Planification" },
      { link: "/addconstantSystem", text: "constante système" },
      { link: "/direct", text: "Effective Standard Directe" },
      { link: "/indirect", text: "Effective Standard Indirecte" },
      { link: "/chains", text: "Chaînes" },
      { link: "/posts", text: "Posts" },
      { link: "/real-direct", text: "Effectif Direct Réel" },
      { link: "/real-indirect", text: "Effectif Indirect Réel" },
      { link: "/coupe", text: "La Coupe" },
      { link: "/production_entre", text: "Production Entre" },
      { link: "/production_sortie", text: "Production Sortie" },
      { link: "/repassage", text: "Repassage" },
      { link: "/control-final", text: "Contrôle Final" },
      { link: "/magasin", text: "Magasin" },
      { link: "/export", text: "Export" },
      { link: "/primes", text: "Primes" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    superadmin: [
      { link: "/dashboard", text: "Tableau de bord" },
      { link: "/products", text: "Produits" },
      { link: "/users", text: "Utilisateurs" },
      { link: "/planning", text: "Planification" },
      { link: "/addconstantSystem", text: "constante système" },
      { link: "/direct", text: "Effective Standard Directe" },
      { link: "/indirect", text: "Effective Standard Indirecte" },
      { link: "/chains", text: "Chaînes" },
      { link: "/posts", text: "Posts" },
      { link: "/real-direct", text: "Effectif Direct Réel" },
      { link: "/real-indirect", text: "Effectif Indirect Réel" },
      { link: "/coupe", text: "La Coupe" },
      { link: "/production_entre", text: "Production Entre" },
      { link: "/production_sortie", text: "Production Sortie" },
      { link: "/repassage", text: "Repassage" },
      { link: "/control-final", text: "Contrôle Final" },
      { link: "/magasin", text: "Magasin" },
      { link: "/export", text: "Export" },
      { link: "/primes", text: "Primes" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    admin: [
      { link: "/dashboard", text: "Tableau de bord" },
      { link: "/products", text: "Produits" },
      { link: "/users", text: "Utilisateurs" },
      { link: "/planning", text: "Planification" },
      { link: "/direct", text: "Effective Standard Directe" },
      { link: "/indirect", text: "Effective Standard Indirecte" },
      { link: "/chains", text: "Chaînes" },
      { link: "/posts", text: "Posts" },
      { link: "/real-direct", text: "Effectif Direct Réel" },
      { link: "/real-indirect", text: "Effectif Indirect Réel" },
      { link: "/coupe", text: "La Coupe" },
      { link: "/production_entre", text: "Production Entre" },
      { link: "/production_sortie", text: "Production Sortie" },
      { link: "/repassage", text: "Repassage" },
      { link: "/control-final", text: "Contrôle Final" },
      { link: "/magasin", text: "Magasin" },
      { link: "/export", text: "Export" },
      { link: "/primes", text: "Primes" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    Logistique: [
      { link: "/products", text: "Produits" },
      { link: "/addproducts", text: "Ajouter un produit" },
      { link: "/export", text: "Export" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    Méthode: [
      { link: "/direct", text: "Effective Standard Directe" },
      { link: "/indirect", text: "Effective Standard Indirecte" },
      { link: "/planning", text: "Planification" },
      { link: "/posts", text: "Posts" },
      { link: "/primes", text: "Primes" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    HR: [
      { link: "/users", text: "Utilisateurs" },
      { link: "/chains", text: "Chaînes" },
      { link: "/real-direct", text: "Effectif Direct Réel" },
      { link: "/real-indirect", text: "Effectif Indirect Réel" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    Production_coupe: [
      { link: "/coupe", text: "La Coupe" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    Production_repassage: [
      { link: "/repassage", text: "Repassage" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    Chaîne_production_entrée: [
      { link: "/production_entre", text: "Production Entre" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    Chaîne_production_sortie: [
      { link: "/production_sortie", text: "Production Sortie" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    Contrôle_final: [
      { link: "/control-final", text: "Contrôle Final" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    Magasin_fourniture: [
      { link: "/magasin_fourniture", text: "Magasin Fourniture" },
      { link: "/plastique_file", text: "Plastique and Fil" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
    Magasin_final: [
      { link: "/magasin", text: "Magasin" },
      { link: `/profile/${userId}`, text: "Profil" },
    ],
  };

  // render the links base on the logged in user
  const renderLinks = () => {
    const roleLinks = links[role] || [];
    return roleLinks.map((link, index) => (
      <LinkIcon key={index} link={link.link} text={link.text} />
    ));
  };

  return (
    <div
      className={`w-1/2 md:w-1/6 mt-20 bg-white fixed h-[calc(100vh-5rem)] pb-[5rem] overflow-y-auto 
              ${
                sidebar ? "left-0 shadow-lg shadow-gray-500" : "left-[-200%]"
              } md:left-0`}
    >
      {renderLinks()}
    </div>
  );
};

export default Sidebar;
