import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import Index from "./pages/Index";
import DealDetail from "./pages/DealDetail";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Guias from "./pages/Guias";
import GuiaDetail from "./pages/GuiaDetail";
import OfertasDoDia from "./pages/OfertasDoDia";
import OfertasAmazon from "./pages/OfertasAmazon";
import OfertasShopee from "./pages/OfertasShopee";
import NotFound from "./pages/NotFound";
import Redirect from "./pages/Redirect";
import Categorias from "./pages/Categorias";
import CategoryHub from "./pages/CategoryHub";
import BrandHub from "./pages/BrandHub";
import StoreHub from "./pages/StoreHub";
import IntentHubPage from "./pages/IntentHub";
import Tendencias from "./pages/Tendencias";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import { INTENT_HUBS } from "./lib/seo-taxonomy";

const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/oferta/:slug" element={<DealDetail />} />
          <Route path="/ofertas-do-dia" element={<OfertasDoDia />} />
          <Route path="/ofertas-amazon" element={<OfertasAmazon />} />
          <Route path="/ofertas-shopee" element={<OfertasShopee />} />
          <Route path="/tendencias" element={<Tendencias />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          <Route path="/perfil" element={<Profile />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/termos" element={<Terms />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/guias" element={<Guias />} />
          <Route path="/guias/:slug" element={<GuiaDetail />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categoria/:slug" element={<CategoryHub />} />
          <Route path="/marca/:slug" element={<BrandHub />} />
          <Route path="/loja/:slug" element={<StoreHub />} />
          {INTENT_HUBS.map((hub) => (
            <Route key={hub.path} path={hub.path} element={<IntentHubPage />} />
          ))}
          <Route
            path="/admin/analytics"
            element={
              <Suspense fallback={null}>
                <AdminAnalytics />
              </Suspense>
            }
          />
          <Route path="/r/:code" element={<Redirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
