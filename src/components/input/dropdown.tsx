import { Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import React from 'react';
import tailwindMerge from '../../utils/tailwind-merge';
import Down from '../icons/16/Down';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

export type DropdownOption<T> = {
    id: T;
    name: string;
};

export type DropdownProps<T, TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
    label: string;
    options: DropdownOption<T>[];
    className?: React.HTMLAttributes<'div'>['className'];
} & UseControllerProps<TFieldValues, TName>;

export default function Dropdown<T extends React.Key, TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(props: DropdownProps<T, TFieldValues, TName>) {
    const {
        className,
        options,
        label,
        name,
        rules,
        shouldUnregister,
        defaultValue,
        control,
        disabled,
    } = props;

    const { field, fieldState } = useController({ name, rules, shouldUnregister, defaultValue, control, disabled });

    return (
        <Field className={tailwindMerge('relative', className)}>
            <Listbox as="div" {...field}>
                <ListboxButton className={tailwindMerge(
                    'group peer w-full',
                    'pl-[0.875rem] pr-[2.875rem] pt-6 pb-2 rounded-xl',
                    'bg-white border-2 border-grey-2 transition-colors duration-150 ease-in-out',
                    'placeholder-transparent [&::placeholder]:transition-all [&::placeholder]:duration-150 [&::placeholder]:ease-in-out',
                    'text-p text-dark-strong text-left focus:outline-none caret-primary',
                    'focus:border-primary-pressed data-[open]:border-primary-pressed',
                    field.value === null && 'text-transparent',
                    fieldState.error && 'border-error focus:border-error',
                )}
                >
                    <div>{field.value?.name || label}</div>
                    <Down
                        className={tailwindMerge('transition duration-150 absolute top-[1.375rem] right-[0.875rem] group-data-[open]:rotate-180')}
                        color="#5B5E70"
                    />
                </ListboxButton>
                <ListboxOptions
                    anchor="bottom"
                    modal={false}
                    transition
                    className={tailwindMerge(
                        '[--anchor-max-height:288px] [--anchor-gap:0.25rem] w-[var(--button-width)]',
                        'flex flex-col',
                        'bg-white rounded-xl border-2 border-primary shadow-dialogue !overflow-hidden',
                        'focus:outline-none',
                        'transition',
                        'data-[closed]:opacity-0 data-[closed]:scale-95',
                        'data-[enter]:ease-out data-[enter]:duration-100',
                        'data-[leave]:ease-in data-[leave]:duration-75',
                    )}
                >
                    <div className={tailwindMerge(
                        'h-full overflow-y-scroll',
                        'flex flex-col gap-1 p-1 items-stretch overflow-y-scroll',
                        '[scrollbar-width:thin] [scrollbar-color:#B9B9C8_#FFFFFF]',
                        '[--webkit-scrollbar-width:thin] [--webkit-scrollbar-color:#B9B9C8_#FFFFFF]',
                    )}
                    >
                        {options.map(v => (
                            <ListboxOption
                                key={v.id}
                                value={v}
                                className="group"
                            >
                                <div className={tailwindMerge(
                                    'w-full text-left rounded-lg px-4 py-[0.875rem] text-p text-dark-strong cursor-default select-none',
                                    'transition-colors duration-75 ease-in-out',
                                    'group-data-[focus]:bg-secondary',
                                    'group-data-[selected]:text-primary group-data-[selected]:font-bold',
                                    'active:!bg-secondary-pressed',
                                )}
                                >
                                    {v.name}
                                </div>
                            </ListboxOption>
                        ))}
                    </div>
                </ListboxOptions>
            </Listbox>
            <Label
                className={tailwindMerge(
                    'transition-all duration-150 ease-in-out absolute left-4 top-[1.125rem]',
                    '-translate-y-[0.625rem]',
                    'text-caption text-dark-medium',
                    field.value === null && 'translate-y-0 text-p',
                    'pointer-events-none',
                )}
            >
                {label}
            </Label>
        </Field>
    );
}
