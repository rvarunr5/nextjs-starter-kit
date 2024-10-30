import SignInForm from "@/components/auth/SignInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { message?: string; requireEmailVerification?: boolean };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">Sign In</CardTitle>
            {/* <CardDescription>
              Create a new account to get started
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <SignInForm searchParams={searchParams} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
