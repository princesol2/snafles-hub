import React, { useMemo, useState } from 'react'
import {
  User,
  Shield,
  Package,
  SlidersHorizontal,
  Award,
  HelpCircle,
  ChevronRight,
  Download,
  Bell,
  Globe2,
  Lock,
} from 'lucide-react'

// Lightweight card and button primitives styled like shadcn/ui using Tailwind
const Card = ({ className = '', children }) => (
  <div className={`bg-white border rounded-xl shadow-sm ${className}`}>{children}</div>
)
const CardHeader = ({ className = '', children }) => (
  <div className={`px-6 pt-6 pb-3 ${className}`}>{children}</div>
)
const CardTitle = ({ className = '', children }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h3>
)
const CardDescription = ({ className = '', children }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
)
const CardContent = ({ className = '', children }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
)
const Button = ({ className = '', variant = 'default', children, ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-gray-50 text-gray-700',
    outline: 'border border-gray-200 hover:bg-gray-50 text-gray-700',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Accessible Switch styled like shadcn/ui using Tailwind (no external dependency)
const Switch = ({ checked, onChange, id }) => (
  <label htmlFor={id} className="relative inline-flex h-6 w-11 cursor-pointer items-center">
    <input
      id={id}
      type="checkbox"
      className="peer sr-only"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
    />
    <span className="absolute inset-0 rounded-full bg-gray-200 transition peer-checked:bg-blue-600" />
    <span className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
  </label>
)

const MenuItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full group flex items-center justify-between rounded-lg px-4 py-3 text-left transition-colors border
      ${isActive ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-gray-700 hover:bg-gray-50 border-transparent'}`}
  >
    <span className="flex items-center gap-3">
      <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
      <span className="font-medium">{label}</span>
    </span>
    <ChevronRight className={`h-4 w-4 ${isActive ? 'opacity-100 text-blue-600' : 'opacity-0 group-hover:opacity-100 text-gray-400'}`} />
  </button>
)

const Section = ({ title, description, children, className = '' }) => (
  <Card className={`overflow-hidden ${className}`}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

const UserSettings = () => {
  const MENU = useMemo(
    () => [
      { key: 'profile', label: 'Profile & Security', icon: Shield },
      { key: 'orders', label: 'Orders', icon: Package },
      { key: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
      { key: 'helper', label: 'Helper Points', icon: Award },
      { key: 'support', label: 'Support', icon: HelpCircle },
    ],
    []
  )

  const [active, setActive] = useState('profile')

  // Preferences state (placeholder)
  const [currency, setCurrency] = useState('INR')
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    helperRequests: false,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account, preferences, and helper points</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-4">
              <div className="flex items-center gap-3 px-2 py-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Account</div>
                  <div className="font-semibold text-gray-900">Settings Menu</div>
                </div>
              </div>
              <div className="h-px w-full bg-gray-100 my-2" />
              <div className="space-y-2">
                {MENU.map((m) => (
                  <MenuItem
                    key={m.key}
                    icon={m.icon}
                    label={m.label}
                    isActive={active === m.key}
                    onClick={() => setActive(m.key)}
                  />
                ))}
              </div>
            </Card>
          </aside>

          {/* Main content */}
          <section className="lg:col-span-3 space-y-6">
            {active === 'profile' && (
              <div className="space-y-6">
                <Section title="Profile & Security" description="Manage your profile info, password, and authentication">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Profile Details</div>
                          <div className="text-sm text-gray-500">Name, photo, contact</div>
                        </div>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Lock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Password</div>
                          <div className="text-sm text-gray-500">Update your password</div>
                        </div>
                      </div>
                      <Button variant="outline">Update</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">2FA</div>
                          <div className="text-sm text-gray-500">Add extra security</div>
                        </div>
                      </div>
                      <Button>Enable</Button>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {active === 'orders' && (
              <div className="space-y-6">
                <Section title="Orders" description="View and manage your orders">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Order History</div>
                        <div className="text-sm text-gray-500">Track past orders and statuses</div>
                      </div>
                    </div>
                    <Button>View Orders</Button>
                  </div>
                </Section>
              </div>
            )}

            {active === 'preferences' && (
              <div className="space-y-6">
                <Section title="Preferences" description="Customize your experience and notifications">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Currency Selection */}
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle className="text-lg">Currency Selection</CardTitle>
                        <CardDescription>Select your preferred currency</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <Globe2 className="h-5 w-5 text-gray-500" />
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="block w-48 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="INR">INR — ₹ Indian Rupee</option>
                            <option value="USD">USD — $ US Dollar</option>
                            <option value="EUR">EUR — € Euro</option>
                          </select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle className="text-lg">Notification Settings</CardTitle>
                        <CardDescription>Control what updates you receive</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Bell className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">Order Updates</div>
                                <div className="text-sm text-gray-500">Receive notifications about your order status</div>
                              </div>
                            </div>
                            <Switch
                              id="order-updates"
                              checked={notifications.orderUpdates}
                              onChange={(v) => setNotifications((s) => ({ ...s, orderUpdates: v }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Award className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">Helper Requests</div>
                                <div className="text-sm text-gray-500">Be notified when someone requests help</div>
                              </div>
                            </div>
                            <Switch
                              id="helper-requests"
                              checked={notifications.helperRequests}
                              onChange={(v) => setNotifications((s) => ({ ...s, helperRequests: v }))}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Section>
              </div>
            )}

            {active === 'helper' && (
              <div className="space-y-6">
                <Section title="Helper Points" description="Track, redeem and understand your impact">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Balance Overview */}
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle className="text-lg">Balance Overview</CardTitle>
                        <CardDescription>Your current points and level</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                            <Award className="h-6 w-6 text-amber-600" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">2,450 pts</div>
                            <div className="text-sm text-gray-500">Contributor Level: Gold</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Download Statement */}
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle className="text-lg">Download Statement</CardTitle>
                        <CardDescription>Export recent helper points activity</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="gap-2">
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Transaction History */}
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">Transaction History</CardTitle>
                      <CardDescription>Recent points earned and redeemed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y divide-gray-100">
                        {[
                          { id: 1, label: 'Assisted order #4821', delta: '+120', date: 'Sep 28, 2025' },
                          { id: 2, label: 'Redeemed voucher', delta: '-300', date: 'Sep 22, 2025' },
                          { id: 3, label: 'Weekly contribution bonus', delta: '+50', date: 'Sep 20, 2025' },
                        ].map((t) => (
                          <div key={t.id} className="flex items-center justify-between py-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{t.label}</div>
                              <div className="text-xs text-gray-500">{t.date}</div>
                            </div>
                            <div className={`text-sm font-semibold ${t.delta.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {t.delta} pts
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contributor Impact */}
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">Contributor Impact</CardTitle>
                      <CardDescription>Your positive impact as a helper</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[{ k: 'Orders Helped', v: 18 }, { k: 'Avg. Rating', v: '4.8' }, { k: 'Streak', v: '7 days' }, { k: 'Badges', v: 5 }].map((i) => (
                          <div key={i.k} className="p-4 rounded-lg border bg-white text-center">
                            <div className="text-xs text-gray-500">{i.k}</div>
                            <div className="mt-1 text-lg font-semibold text-gray-900">{i.v}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Section>
              </div>
            )}

            {active === 'support' && (
              <div className="space-y-6">
                <Section title="Support" description="We’re here to help">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="font-medium text-gray-900">Help Center</div>
                      <div className="text-sm text-gray-500">Browse FAQs and guides</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-medium text-gray-900">Contact Support</div>
                      <div className="text-sm text-gray-500">Email or chat with us</div>
                    </div>
                  </div>
                </Section>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default UserSettings

