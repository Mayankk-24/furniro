import React from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure,
} from "@heroui/react";
import { RiMenu3Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';


function Sidebar() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const authToken = localStorage.getItem('token');

    const LinkNames = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];
    return (
        <>
            <Button onPress={onOpen} className='block md:hidden px-1.5' isIconOnly><RiMenu3Fill size={24} /></Button>
            <Drawer
                isOpen={isOpen}
                motionProps={{
                    variants: {
                        enter: {
                            opacity: 1,
                            x: 0,
                            duration: 0.3,
                        },
                        exit: {
                            x: 100,
                            opacity: 0,
                            duration: 0.3,
                        },
                    },
                }}
                onOpenChange={onOpenChange}
                size='xs'
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">Menu</DrawerHeader>
                            <DrawerBody>
                                <div className='flex flex-col justify-center space-y-5 p-5'>
                                    {LinkNames.map((link, index) => (
                                        <Link
                                            to={link.path}
                                            key={index}
                                            className='text-black text-center hover:text-gray-500'
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                                {authToken ? (
                                    <button className="text-red-500">Logout</button>
                                ) : (
                                    <Link to='/signin' className="text-blue-700" onPress={onClose}>Sign In</Link>
                                )}
                            </DrawerBody>
                            {/* <DrawerFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </DrawerFooter> */}
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default Sidebar