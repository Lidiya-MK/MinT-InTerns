import React from "react";
import { Card, CardContent } from "../components/card2";
import { Input } from "../components/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "../components/button";
import logo from "../assets/logo.png";

const LoginLayout = ({ title, onSubmit, email, setEmail, password, setPassword, footer }) => {
  return (
<div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4" style={{ backgroundColor: "#144145" }}>

      <Card className="w-full max-w-md p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4 text-[#144145]">{title}</h1>
        <CardContent className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="block mb-1 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block mb-1 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-[#D25B24] hover:bg-[#b3471c]">
              Login
            </Button>
          </form>
          {footer && <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">{footer}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginLayout;
