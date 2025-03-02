// import { ColumnDef } from "@tanstack/react-table";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// // Define columns
// interface DataTableProps<TData> {
//   columns: ColumnDef<TData, any>[];
//   data: TData[];
// }

// export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
//   return (
//     <Table>
//       <TableHeader>
//         {columns.map((column) => (
//           <TableHead key={column.id}>{column.header}</TableHead>
//         ))}
//       </TableHeader>
//       <TableBody>
//         {data.map((row, rowIndex) => (
//           <TableRow key={rowIndex}>
//             {columns.map((column) => (
//               <TableCell key={column.id}>{row[column.id]}</TableCell>
//             ))}
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }
