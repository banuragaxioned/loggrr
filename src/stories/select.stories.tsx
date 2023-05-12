import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import AvatarImg from '../../public/avatar.png'

export function DefaultSelect() {
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Client" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="p-[5px]">
            <SelectItem value="axioned"><SelectItemText value="">Axioned</SelectItemText></SelectItem>
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
          <SelectGroup className="p-[5px]">
            <SelectItem value="axioned">
              <SelectItemText asChild value="my projects">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="w-7 h-7 border-[0.01rem] border-border-color">
                    <AvatarImage src={`${AvatarImg}`} />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <span>Anurag Basu</span>
                </div>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="cfm">
              <SelectItemText asChild value="my projects">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="w-7 h-7 border-[0.01rem] border-border-color">
                    <AvatarImage src={`${AvatarImg}`} />
                    <AvatarFallback>KA</AvatarFallback>
                  </Avatar>
                  <span>Kashif Ansari</span>
                </div>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="culture15">
              <SelectItemText asChild value="my projects">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="w-7 h-7 border-[0.01rem] border-border-color">
                    <AvatarImage src={`${AvatarImg}`} />
                    <AvatarFallback>SD</AvatarFallback>
                  </Avatar>
                  <span>Shubham Dawkhar</span>
                </div>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="shutterstock">
              <SelectItemText asChild value="my projects">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="w-7 h-7 border-[0.01rem] border-border-color">
                    <AvatarImage src={`${AvatarImg}`} />
                    <AvatarFallback>VY</AvatarFallback>
                  </Avatar>
                  <span>Vipin Yadav</span>
                </div>
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
      <Select>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select Project Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="p-[5px]">
            <SelectItem value="my projects">
              <SelectItemText asChild value="my projects">
                <div className="flex items-center justify-between gap-2 w-full">
                  <span>My Projects</span>
                  <span>(5)</span>
                </div>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="active projects">
              <SelectItemText asChild value="my projects">
                <div className="flex items-center justify-between gap-2 w-full">
                  <span>Active Projects</span>
                  <span className="ml-auto">(3)</span>
                </div>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="client projects">
              <SelectItemText asChild value="my projects">
                <div className="flex items-center justify-between gap-2 w-full">
                  <span>Client Projects</span>
                  <span>(4)</span>
                </div>
              </SelectItemText>
            </SelectItem>
            <SelectItem value="archive projects">
              <SelectItemText asChild value="my projects">
                <div className="flex items-center justify-between gap-2 w-full">
                  <span>Archive Projects</span>
                  <span>(8)</span>
                </div>
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}


