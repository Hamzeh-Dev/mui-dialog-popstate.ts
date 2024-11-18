import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DialogContextType {
    openDialogs: string[];
    openDialog: (dialogKey: string) => void;
    closeDialog: () => void;
    closeSpecificDialog: (dialogKey: string) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [openDialogs, setOpenDialogs] = useState<string[]>([]);

    const openDialog = (dialogKey: string) => {
        setOpenDialogs((prev) => [...prev, dialogKey]);
        window.history.pushState({ dialogKey }, "");
    };

    // * This to Close all open Dialogs
    const closeDialog = () => {
        setOpenDialogs((prev) => {
            if (prev.length > 0) {
                const newDialogs = [...prev];
                newDialogs.pop();
                return newDialogs;
            }
            return prev;
        });
        window.history.back();
    };

    const closeSpecificDialog = (dialogKey: string) => {
        setOpenDialogs((prev) => prev.filter((key) => key !== dialogKey));
    };

    useEffect(() => {
        const handlePopState = () => {
            setOpenDialogs((prev) => {
                if (prev.length > 0) {
                    const newDialogs = [...prev];
                    newDialogs.pop();
                    return newDialogs;
                }
                return prev;
            });
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    return (
        <DialogContext.Provider value={{ openDialogs, openDialog, closeDialog, closeSpecificDialog }}>
            {children}
        </DialogContext.Provider>
    );
};

export const useDialog = (): DialogContextType => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog must be used within a DialogProvider");
    }
    return context;
};
