import { Client } from "../../hooks/useClientSort";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  
} from "../../components/ui/table";
import { FileSpreadsheet, Table2 } from "lucide-react";

type Props = {
  clients: Client[];
};

export default function ClientTable({ clients }: Props) {
  return (
    <div className="flex-1">
      <Table >
       
        <TableHeader>
          <TableRow className="bg-gray-50 ">
            <TableHead><Table2/></TableHead>
            <TableHead>Client ID</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Client Type</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Updated By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody >
          {clients.map((client) => (
            <TableRow  key={client.id}>
              <TableCell></TableCell>
              <TableCell className="text-blue-600 font-mono">{client.id}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.type}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell><span className={`${ client.status === "Active" ? "bg-green-200/50" : "bg-red-200/50"} py-1 px-2  rounded-xl`}><span className={`${client.status === "Active" ? "bg-green-600" : "bg-red-600"} rounded-full p-1 mb-0.5 inline-block  mr-1`}></span>{client.status === "Active" ? "Active" : "Inactive"}</span></TableCell>
              <TableCell>{new Date(client.createdAt).toISOString().replace('T', ' ').slice(0, 19)}</TableCell>
              <TableCell>{new Date(client.updatedAt).toISOString().replace('T', ' ').slice(0, 19)}</TableCell>
              <TableCell>{client.updatedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 