import cn from "classnames"

const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ className, children }) => {
  return <header className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</header>
}

const CardTitle = ({ className, children }) => {
  return <h2 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>{children}</h2>
}

const CardDescription = ({ className, children }) => {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}

const CardContent = ({ className, children }) => {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }

