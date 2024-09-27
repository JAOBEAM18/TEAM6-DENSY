'use client'
import { useTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import lightLogo from "/app/img/system_logo_light.png"
import darkLogo from "/app/img/system_logo_dark.png"
import loginCover from "/app/img/login_cover.png"
import Image from 'next/image'
import { useTheme } from 'next-themes';
import LanguageSelect from '@/components/language-select';
import ModeToggle from '@/components/mode-toggle';
import Textfield from '@/components/textfield';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from "next-intl";
import { Checkbox } from '@/components/ui/checkbox';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import jwtDecode from 'jwt-decode'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import FormError from '@/components/form-error'
import FormSuccess from '@/components/form-success'
import { login } from '@/lib/api';

export const LoginSchema = z.object({
    username: z.string(),
    password: z.string(),
    rememberMe: z.boolean().optional()
})


export default function LoginPage() {
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')
    const router = useRouter()
    const locale = useLocale()
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const t = useTranslations('General')
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: "",
            password: "",
            rememberMe: false
        },
    })

    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) {
        return null
    }


    function onSubmit(values: z.infer<typeof LoginSchema>) {
        setError('')
        setSuccess('')
         startTransition(async () => {
            const result = await login(values)
            router.refresh()
            if (result.error) {
                setError(result.error)
            } else if (result.token) {
                setSuccess('Login successfully!')
                // const decodedToken = jwtDecode(result.token);
                // const userRole = decodedToken.role
                // console.log(userRole)
                // if (result.role === 'patrol') {
                //     router.push(`/${locale}/patrol`);
                // } else if (result.role === 'admin') {
                //     router.push(`/${locale}/admin`);
                // } else {
                //     router.push(`/${locale}`);
                // }
            }
        });
    }
    return (
        <section className="bg-card flex justify-between h-screen p-2">
            <div className="bg-background w-full rounded-md grid grid-rows-5 p-4">
                <Image
                    className="flex items-center"
                    src={theme === 'dark' ? darkLogo : lightLogo}
                    alt="Logo"
                    width={250}
                    priority
                />
                <div className="grid grid-rows-subgrid gap-4 row-span-3 justify-center items-center">
                    <Image
                        className="flex items-center row-start-2"
                        src={loginCover}
                        alt="Cover"
                        width={500}
                        height={500}
                        priority

                    />
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <div className='flex w-full justify-end gap-4'>
                    <ModeToggle />
                    <LanguageSelect />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <div className='gap-2 flex flex-col justify-center items-start w-[450px] h-full'>
                    <h1 className='text-5xl font-semibold'>{t('Login')}</h1>
                    <p>{t('EnterCredentials')}</p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className='mt-6'>
                                        <label className='text-xl font-semibold'>{t('Username')}</label>
                                        <FormControl>
                                            <Textfield className='bg-secondary' showIcon={true} iconName='person' placeholder='johnDoe' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className='mt-6'>
                                        <label className='text-xl font-semibold mt-6'>{t('Password')}</label>
                                        <FormControl>
                                            <Textfield className='bg-secondary' type='password' showIcon={true} iconName='lock' placeholder='verySecure' {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="terms1" />
                                    <label
                                        htmlFor="terms1"
                                        className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer"
                                    >
                                        {t('RememberMe')}
                                    </label>
                                </div>
                                <Button variant='link'>{t('ForgotPassword')}</Button>
                            </div>
                            <Button size="lg" className='mt-6' disabled={isPending}>
                                {t('Login')}
                                <span className="material-symbols-outlined">
                                    login
                                </span>
                            </Button>
                        </form>

                    </Form>
                </div>
            </div>
        </section >
    );
}
