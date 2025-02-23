import React, { useEffect, useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { UserButton, useUser } from "@clerk/clerk-react";

export function Navbar() {
    const { isSignedIn, user } = useUser();
    const [isUserLoaded, setIsUserLoaded] = useState(false);

    useEffect(() => {
        if (isSignedIn && user && !isUserLoaded) {
            setIsUserLoaded(true); // Prevent multiple API calls

            const userData = {
                id: user.id,
                name: user.firstName,
                email: user.primaryEmailAddress?.emailAddress,
            };

            fetch("http://localhost:3000/api/save-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            })
            .then((res) => res.json())
            .then((data) => console.log("User saved:", data))
            .catch((err) => console.error("Error saving user:", err));
        }
    }, [isSignedIn, user, isUserLoaded]); // Runs only when user data is ready

    return (
        <div className="h-16 bg-white border-b fixed top-0 right-0 left-64 z-10">
            <div className="h-full px-4 flex items-center justify-between">
                <div className="flex items-center flex-1">
                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    
                    <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                        <UserButton afterSignOutUrl="/login" />
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
