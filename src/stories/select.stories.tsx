import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
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
            <SelectItem value="axioned">Axioned</SelectItem>
            <SelectItem value="cfm">CFM</SelectItem>
            <SelectItem value="culture15">Culture 15</SelectItem>
            <SelectItem value="shutterstock">Shutterstock</SelectItem>
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
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://placekitten.com/100/100" />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <span>Anurag Basu</span>
              </div>
            </SelectItem>
            <SelectItem value="cfm">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://placekitten.com/100/100" />
                  <AvatarFallback>KA</AvatarFallback>
                </Avatar>
                <span>Kashif Ali</span>
              </div>
            </SelectItem>
            <SelectItem value="culture15">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://placekitten.com/100/100" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <span>Shubham Dawkhar</span>
              </div>
            </SelectItem>
            <SelectItem value="shutterstock">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://placekitten.com/100/100" />
                  <AvatarFallback>VY</AvatarFallback>
                </Avatar>
                <span>Vipin Yadav</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
