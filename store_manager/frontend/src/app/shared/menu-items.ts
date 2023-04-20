import { Injectable } from "@angular/core";

export interface Menu{
    state : string;
    name: string;
    icon: string;
    role: string;
}

const MENUITEMS = [
    {state:'dashboard', name:'Dashboard', icon:'dashboard',role:''},
    {state:'category', name:'Manage Category', icon:'category',role:'admin'},
    {state:'product', name:'Manage Product', icon:'inventory',role:'admin'},
    {state:'order', name:'Manage Order', icon:'receipt_long',role:''},
    {state:'bill', name:'View Bill', icon:'contacts',role:''},
    {state:'user', name:'Manage User', icon:'people',role:'admin'}
];

@Injectable()
export class MenuItems{
    getMenuItem(): Menu[]{
        return MENUITEMS;
    }
}