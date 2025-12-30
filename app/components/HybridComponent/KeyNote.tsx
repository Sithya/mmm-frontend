import AdminKeynote from "../AdminComponent/Admin_keynote";
import UserKeyNotes from "../UserComponent/User_Keynotes";

type Props = {
  pageId: number;
  isAdmin: boolean;
};

export default function Keynotes({ pageId, isAdmin }: Props) {
  if (isAdmin) {
    return <AdminKeynote pageId={pageId} />;
  }

  return <UserKeyNotes pageId={pageId} />;
}
