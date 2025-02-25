import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/auth/use-auth";
import { Button } from "../ui/button";
import { useState } from "react";

export default function CustomerLogin() {
  const auth = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uid, setUid] = useState("");

  const handleDialogSubmit = () => {
    if (!uid.trim()) {
      alert("Please enter your UID!");
      return;
    }
    auth?.loginCustomer(uid);

    setIsDialogOpen(false);
    setUid("");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>Login</Button>
      </DialogTrigger>
      <DialogContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Customer Login</h2>
        <Input
          type="text"
          placeholder="Enter your uid"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleDialogSubmit} className="w-full">
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
