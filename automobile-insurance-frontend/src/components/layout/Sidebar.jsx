import { Link } from "react-router-dom";

function Sidebar(){

    return(

        <div
            style={{
                width:"220px",
                background:"#0d6efd",
                color:"white",
                padding:"20px",
                minHeight:"100vh"
            }}
        >

            <h3>Modules</h3>

            <hr/>

            <p><Link to="/users">Users</Link></p>

            <p><Link to="/policies">Policies</Link></p>

            <p><Link to="/proposals">Proposals</Link></p>

            <p><Link to="/quotes">Quotes</Link></p>

            <p><Link to="/payments">Payments</Link></p>

            <p><Link to="/claims">Claims</Link></p>

            <p><Link to="/documents">Documents</Link></p>

        </div>

    );

}

export default Sidebar;