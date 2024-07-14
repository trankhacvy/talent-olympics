"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/utils/cn"
import { XIcon } from "lucide-react"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <XIcon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

// import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
// import * as React from "react"
// import { tv, type VariantProps } from "tailwind-variants"
// import { cn } from "@/utils/cn"
// import { buttonVariants } from "@/components/ui/button"

// const AlertDialog = AlertDialogPrimitive.Root

// const AlertDialogTrigger = AlertDialogPrimitive.Trigger

// const AlertDialogPortal = ({ children, ...props }: AlertDialogPrimitive.AlertDialogPortalProps) => (
//   <AlertDialogPrimitive.Portal {...props}>
//     <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">{children}</div>
//   </AlertDialogPrimitive.Portal>
// )

// const AlertDialogOverlay = React.forwardRef<
//   React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
//   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
// >(({ className, ...props }, ref) => (
//   <AlertDialogPrimitive.Overlay
//     className={cn("fixed inset-0 z-50 bg-gray-800/8 backdrop-blur-sm transition-opacity animate-in fade-in", className)}
//     {...props}
//     ref={ref}
//   />
// ))

// AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

// const contentStyles = tv({
//   variants: {
//     maxWidth: {
//       xs: "max-w-xs",
//       sm: "max-w-sm",
//       md: "max-w-md",
//       lg: "max-w-lg",
//       xl: "max-w-xl",
//       "2xl": "max-w-2xl",
//     },
//     fullWidth: {
//       true: "w-full",
//     },
//   },
//   defaultVariants: {
//     fullWidth: true,
//     maxWidth: "md",
//   },
// })

// const AlertDialogContent = React.forwardRef<
//   React.ElementRef<typeof AlertDialogPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & VariantProps<typeof contentStyles>
// >(({ className, maxWidth, fullWidth, ...props }, ref) => (
//   <AlertDialogPortal>
//     <AlertDialogOverlay />
//     <AlertDialogPrimitive.Content
//       ref={ref}
//       className={cn(
//         "fixed z-50 scale-100 rounded-2xl bg-white p-6 opacity-100 shadow-dialog",
//         "animate-in fade-in-90 slide-in-from-bottom-10",
//         "sm:zoom-in-90 sm:slide-in-from-bottom-0",
//         contentStyles({ maxWidth, fullWidth }),
//         className
//       )}
//       {...props}
//     />
//   </AlertDialogPortal>
// ))

// const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
//   <div className={cn("flex flex-col text-center sm:text-left", className)} {...props} />
// )

// const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
//   <div className={cn("mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4", className)} {...props} />
// )

// const AlertDialogTitle = React.forwardRef<
//   React.ElementRef<typeof AlertDialogPrimitive.Title>,
//   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
// >(({ className, ...props }, ref) => (
//   <AlertDialogPrimitive.Title ref={ref} className={cn("mb-6 text-lg font-bold text-gray-800", className)} {...props} />
// ))

// AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

// const AlertDialogDescription = React.forwardRef<
//   React.ElementRef<typeof AlertDialogPrimitive.Description>,
//   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
// >(({ className, ...props }, ref) => (
//   <AlertDialogPrimitive.Description ref={ref} className={cn("text-gray-600", className)} {...props} />
// ))

// AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

// const AlertDialogAction = React.forwardRef<
//   React.ElementRef<typeof AlertDialogPrimitive.Action>,
//   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
// >(({ className, ...props }, ref) => (
//   <AlertDialogPrimitive.Action
//     ref={ref}
//     className={cn(
//       "mt-2 sm:mt-0",
//       buttonVariants({
//         variant: "solid",
//         ...props,
//       }),
//       className
//     )}
//     {...props}
//   />
// ))

// AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

// const AlertDialogCancel = React.forwardRef<
//   React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
//   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
// >(({ className, ...props }, ref) => (
//   <AlertDialogPrimitive.Cancel
//     ref={ref}
//     className={cn(
//       "mt-2 sm:mt-0",
//       buttonVariants({
//         variant: "outline",
//         ...props,
//       }),
//       className
//     )}
//     {...props}
//   />
// ))

// AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

// export {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogFooter,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogAction,
//   AlertDialogCancel,
// }
