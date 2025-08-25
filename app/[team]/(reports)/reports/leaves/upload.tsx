"use client";

import { FileInput, FileUploaderItem, FileUploader, FileUploaderContent } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Check, CloudUpload, FileSpreadsheet, Loader2, Mail, Paperclip, Sheet, User, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const FileSvgDraw = () => {
  return (
    <>
      <CloudUpload />
      <p className="mb-1 text-sm">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs">Select the XLSX or CSV file</p>
    </>
  );
};

export default function Upload() {
  const { team } = useParams();
  const [files, setFiles] = useState<File[] | null>(null);
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "application/x-iwork-numbers-sffnumbers": [".numbers"],
      "text/csv": [".csv"],
    },
  } satisfies DropzoneOptions;

  useEffect(() => {
    const parseXlsx = async (file: File) => {
      try {
        // Read the file as an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Parse the XLSX file
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Get the first sheet name
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON for easy viewing
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setSheetData(jsonData);
      } catch (error) {
        console.error("Error parsing XLSX file:", error);
      }
    };
    if (files && files.length > 0) {
      const file = files[0];
      parseXlsx(file);
    }
  }, [files]);

  const title = sheetData?.[0]?.[0];
  const users = sheetData.slice(3).filter((row: any) => row[0] !== undefined);

  const handleUpload = async () => {
    const validate = !files || files.length === 0 || users.length === 0;
    const validTitle = title.includes("Leaves Status");

    if (validate || !validTitle) {
      toast.error("Please upload a valid leaves status sheet as per the template");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch(`/api/team/send-leaves`, {
        method: "POST",
        body: JSON.stringify({
          slug: team,
          users,
          subject: title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed to send leaves", { description: data.error });
        return;
      }
      if (response.ok) {
        setSuccess(true);
        toast.success(data.message);
        return;
      }
    } catch (error) {
      toast.error("Failed to send leaves", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      return;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <FileUploader
        value={files}
        onValueChange={setFiles}
        dropzoneOptions={dropZoneConfig}
        className="relative rounded-lg border p-2"
      >
        <FileInput className="outline-dashed outline-1">
          <div className="flex w-full flex-col items-center justify-center pb-4 pt-3">
            <FileSvgDraw />
          </div>
        </FileInput>
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <FileSpreadsheet className="h-4 w-4 stroke-green-700" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>
      {files && files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-lg font-bold">
              <Sheet className="mr-2 h-6 w-6 stroke-green-700" />
              Sheet Data
            </h2>
            <Button variant="outline" onClick={handleUpload} disabled={uploading || success}>
              Send Leaves
              {!uploading && !success && <Mail className="ml-1 h-4 w-4 stroke-current" />}
              {uploading && !success && <Loader2 className="ml-1 h-4 w-4 animate-spin stroke-current" />}
              {!uploading && success && <Check className="ml-1 h-4 w-4 stroke-current" />}
            </Button>
          </div>
          <Separator className="my-2" />
          {title && (
            <p className="mt-2 text-base text-muted-foreground">
              <span className="font-semibold">Email Subject:</span> {title}
            </p>
          )}
          <div className="mt-4">
            <p className="mt-2 text-base text-muted-foreground">
              <span className="font-semibold">All Users</span>
            </p>
            <ul className="mt-2 flex w-full flex-col gap-1">
              {users?.length > 0 &&
                users.map((user, index) => {
                  const name = user[0];
                  const email = user[1];

                  return (
                    <li key={index} className="flex items-start text-sm">
                      <p className="mr-2 min-w-8 text-right">{index + 1}.</p>
                      <p>
                        {name} <span className="text-muted-foreground">({email})</span>
                      </p>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
