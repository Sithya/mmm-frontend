import { apiClient } from "@/lib/api";
import { OrganizationMember } from "@/types";
import OrganizationView from "../components/UserComponent/OrganizationView";
import ImportantDatesServer from "../components/HybridComponent/ImportanceDate/ImportantDatesServer";
import Banner from "../components/UserComponent/Banner";
import { useAuth } from "../components/AuthProvider";


export default async function OrganizationPage() {
  const { user } = useAuth();
  const isAdmin = user?.is_admin === true;

  const members = await apiClient.get<OrganizationMember[]>("/organizations");


  return (
    <>
      <Banner/>
      <div className="flex gap-20 justify-center my-10">
        <div className="max-w-7xl">
          <OrganizationView 
          isAdmin={isAdmin}
          initialMembers={members.data ?? []}/>
        </div>
        

        <div>
            <ImportantDatesServer />
        </div>
        
      </div>
    </>
      
    
    
  );
}
