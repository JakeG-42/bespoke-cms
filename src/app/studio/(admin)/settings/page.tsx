import { Mail, Palette, ShieldCheck } from "lucide-react";

import { saveContactNotificationSettingsAction } from "@/app/studio/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getContactEmailDeliveryStatus } from "@/lib/email-notifications";
import { getContactNotificationSettings } from "@/lib/managed-data";

export const metadata = {
  title: "Settings | Eltronic Studio",
};

export default async function StudioSettingsPage() {
  const [notificationSettings, deliveryStatus] = await Promise.all([
    getContactNotificationSettings(),
    Promise.resolve(getContactEmailDeliveryStatus()),
  ]);
  const recipients = notificationSettings.recipients.join(", ");

  return (
    <div className="grid gap-6">
      <section className="studio-page-header">
        <p>Studio-level notes and controls. More settings can live here as the admin grows.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Mail className="size-5" />
              </div>
              <div>
                <CardTitle>Email notifications</CardTitle>
                <CardDescription>
                  Send contact form alerts for enquiries, captcha failures and honeypot spam.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form action={saveContactNotificationSettingsAction} className="grid gap-4">
              <input name="returnTo" type="hidden" value="/studio/settings" />
              <div className="grid gap-2">
                <Label htmlFor="notificationMode">Frequency</Label>
                <select
                  className="flex h-10 w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  defaultValue={notificationSettings.mode}
                  id="notificationMode"
                  name="notificationMode"
                >
                  <option value="immediate">Immediate - every good and blocked submission</option>
                  <option value="daily_digest">Daily digest - one report each day</option>
                  <option value="weekly_digest">Weekly digest - one report each week</option>
                  <option value="off">Off</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notificationRecipients">Recipients</Label>
                <Input
                  defaultValue={recipients}
                  id="notificationRecipients"
                  name="notificationRecipients"
                  placeholder="jakub@gajosz.com"
                />
                <p className="mb-0 text-xs text-muted-foreground">
                  Comma-separated list. The default recipient is <code>jakub@gajosz.com</code>.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/45 p-4 text-sm text-muted-foreground">
                Delivery provider: <strong className="text-foreground">{deliveryStatus.provider}</strong>. Status:{" "}
                <strong className={deliveryStatus.configured ? "text-emerald-300" : "text-amber-300"}>
                  {deliveryStatus.configured ? "configured" : "missing Vercel env vars"}
                </strong>
                . Sender: <code>{deliveryStatus.from || "CONTACT_NOTIFICATION_FROM not set"}</code>.
              </div>
              <Button className="w-full sm:w-fit" type="submit">
                Save email settings
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Palette className="size-5" />
              </div>
              <div>
                <CardTitle>Studio theme</CardTitle>
                <CardDescription>Use the top-right toggle to switch Studio between dark and light modes.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-0 text-sm text-muted-foreground">
              The selected theme is stored in this browser with <code>localStorage</code>, so it will not affect the
              public website or other users.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Current temporary login is intentionally simple while the admin is private.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-0 text-sm text-muted-foreground">
              Defaults are <code>admin</code> / <code>password</code>. Override later with
              <code> ELTRONIC_ADMIN_USERNAME</code>, <code> ELTRONIC_ADMIN_PASSWORD</code> and
              <code> ELTRONIC_ADMIN_SECRET</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
