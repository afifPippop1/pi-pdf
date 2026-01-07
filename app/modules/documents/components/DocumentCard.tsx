import { CiCloudOff, CiCloudOn } from "react-icons/ci";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Document } from "~/types/documents.type";
import { timeToNow } from "~/utils/time";

export function DocumentCard({ doc }: { doc: Document }) {
  const navigate = useNavigate();
  function handleClick() {
    navigate(`/documents/${doc.id}`);
  }

  return (
    <Card onClick={handleClick} className="cursor-pointer">
      <CardHeader className="flex justify-between">
        <CardTitle className="flex-1">{doc.name}</CardTitle>
        {doc.label === "cloud" ? <CiCloudOn /> : <CiCloudOff />}
        <p className="text-xs text-gray-400">{timeToNow(doc.created_at)}</p>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
