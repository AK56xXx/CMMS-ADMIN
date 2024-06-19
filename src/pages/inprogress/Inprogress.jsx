import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";



const Inprogress = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
      <Navbar />
        
      </div>
    </div>
  );
};

export default Inprogress;
