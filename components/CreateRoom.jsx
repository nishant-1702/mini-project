
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateRoom() {
  return (
    <Dialog>
      <DialogTrigger render={<Button className=" bg-purple-600 px-7 text-md font-extrabold cursor-pointer py-6.5 rounded-lg mt-5 hover:bg-purple-600">
        Create Room
      </Button>} />

      <DialogContent className="sm:max-w-md bg-foreground text-background ">
        <DialogHeader>
          <DialogTitle>Create your room 🎬</DialogTitle>
          <DialogDescription>
            Enter your details to start a private watch party.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <Label htmlFor="hostName">Your Name</Label>
            <Input
              id="hostName"
              name="hostName"
              placeholder="Enter your name"
              required
              className="bg-background text-foreground"
            />
          </Field>

          <Field>
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              name="roomName"
              placeholder="e.g. Friday Movie Night"
              required
              className="bg-background text-foreground"
            />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" className="bg-background text-foreground px-3.5 ">
            Cancel
          </Button>} />

          <Button type="button" className="bg-purple-600 hover:bg-purple-500">
            Create Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
