import { useSyncExternalStore } from "react";

// The menu a visitor orders from in the intro, and can change from the corner cup
export const DRINKS = [
    { id: "black", name: "Black", note: "Adi’s" },
    { id: "espresso", name: "Espresso" },
    { id: "latte", name: "Latte" },
    { id: "cappuccino", name: "Cappuccino" },
    { id: "iced", name: "Iced" },
] as const;

export type DrinkId = (typeof DRINKS)[number]["id"];

// Anyone who skips the choice gets what I drink
export const DEFAULT_DRINK: DrinkId = "black";

const STORAGE_KEY = "coffeeOrder";
const listeners = new Set<() => void>();

const isDrink = (value: unknown): value is DrinkId => DRINKS.some((drink) => drink.id === value);

// Remembered in this browser so a returning visitor keeps their drink. Storage can be blocked or hold anything,
// so every read and write is guarded and falls back to the default.
function read(): DrinkId {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return isDrink(stored) ? stored : DEFAULT_DRINK;
    } catch {
        return DEFAULT_DRINK;
    }
}

let current: DrinkId = typeof window === "undefined" ? DEFAULT_DRINK : read();

export function getCoffeeOrder(){
    return current;
}

export function setCoffeeOrder(drink: DrinkId){
    if (drink === current) return;
    current = drink;
    try {
        localStorage.setItem(STORAGE_KEY, drink);
    } catch {
        // Ignore; the choice still holds for this visit
    }
    listeners.forEach((listener) => listener());
}

export function subscribeToCoffeeOrder(listener: () => void){
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

/** The visitor's drink, kept in sync everywhere it's shown. */
export function useCoffeeOrder(){
    return useSyncExternalStore(subscribeToCoffeeOrder, getCoffeeOrder, () => DEFAULT_DRINK);
}

export function drinkName(drink: DrinkId){
    return DRINKS.find((d) => d.id === drink)!.name;
}
