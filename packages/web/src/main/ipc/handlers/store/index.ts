import { IpcMainEvent } from "electron";
import { getFromStore, updateStore } from "../../../store";

export const onStoreGet = (event: IpcMainEvent, key: any) => {
    event.returnValue = getFromStore(key);
};

export const onStoreSet = (key: string, value: any) => {
    updateStore(key, value);
};
