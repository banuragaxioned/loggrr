import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DefaultSelect() {
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Client" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="axioned"> <SelectItemText value="">Axioned</SelectItemText></SelectItem>
            <SelectItem value="cfm"><SelectItemText value="">CFM</SelectItemText></SelectItem>
            <SelectItem value="culture15"><SelectItemText value="">Culture 15</SelectItemText></SelectItem>
            <SelectItem value="shutterstock"><SelectItemText value="">Shutterstock</SelectItemText></SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export function SelectWithItemIcon() {
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select Project Lead" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="axioned">
              <SelectItemText value="" className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://placekitten.com/100/100" />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <span>Anurag Basu</span>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="cfm">
              <SelectItemText value="" className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://placekitten.com/100/100" />
                  <AvatarFallback>KA</AvatarFallback>
                </Avatar>
                <span>Kashif Ali</span>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="culture15">
              <SelectItemText value="" className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://placekitten.com/100/100" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <span>Shubham Dawkhar</span>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="shutterstock">
              <SelectItemText value="" className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://placekitten.com/100/100" />
                  <AvatarFallback>VY</AvatarFallback>
                </Avatar>
                <span>Vipin Yadav</span>
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export function SelectWithCount() {
  return (
    <div>
      <Select open={true}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select Project Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="axioned">
              <SelectItemText value="" className="flex items-center gap-2">
                <span>My Projects</span>
                <span>(5)</span>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="cfm">
              <SelectItemText className="flex justify- items-center gap-2" value={""}>
                <span>Active Projects</span>
                <span className="ml-auto">(3)</span>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="culture15">
              <SelectItemText value="" className="flex items-center gap-2">
                <span>Client Projects</span>
                <span>(4)</span>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="shutterstock">
              <SelectItemText value="" className="flex items-center gap-2">
                <span>Archive Projects</span>
                <span>(6)</span>
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}


