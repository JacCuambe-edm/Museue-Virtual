import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import FeaturedStories from './components/sections/FeaturedStories';
import Immersion from './components/sections/Immersion';
import LifeStories from './components/sections/LifeStories';
import Heritage from './components/sections/Heritage';
import LogoCloud from './components/sections/LogoCloud';
import Exhibitions from './components/sections/Exhibitions';
import SobreMuseu from './components/pages/SobreMuseu';
import ApresentacaoEmpresa from './components/pages/ApresentacaoEmpresa';
import Geracao from './components/pages/Geracao';
import Transporte from './components/pages/Transporte';
import Distribuicao from './components/pages/Distribuicao';
import Comercial from './components/pages/Comercial';
import HistoriaGeracao from './components/pages/HistoriaGeracao';
import HistoriaTransporte from './components/pages/HistoriaTransporte';
import HistoriaDistribuicao from './components/pages/HistoriaDistribuicao';
import HistoriaComercial from './components/pages/HistoriaComercial';
import GaleriaPresidentes from './components/pages/GaleriaPresidentes';
import PatrimonioGeracao from './components/pages/PatrimonioGeracao';
import PatrimonioTransporte from './components/pages/PatrimonioTransporte';
import PatrimonioDistribuicao from './components/pages/PatrimonioDistribuicao';
import PatrimonioComercial from './components/pages/PatrimonioComercial';
import PatrimonioDetail from './components/pages/PatrimonioDetail';
import TransmissaoSul from './components/pages/TransmissaoSul';
import TransmissaoCentro from './components/pages/TransmissaoCentro';
import TransmissaoNorte from './components/pages/TransmissaoNorte';
import Exposicoes from './components/pages/Exposicoes';
import ArticleDetail from './components/pages/ArticleDetail';
import ExposicaoDetail from './components/pages/ExposicaoDetail';
import EventoDetail from './components/pages/EventoDetail';
import ArtefatosGeracao from './components/pages/ArtefatosGeracao';
import ArtefatosTransporte from './components/pages/ArtefatosTransporte';
import ArtefatosDistribuicao from './components/pages/ArtefatosDistribuicao';
import ArtefatosComercial from './components/pages/ArtefatosComercial';
import ArtefatoDetail from './components/pages/ArtefatoDetail';
import TimelinePage from './components/pages/TimelinePage';
import HistoriaPage from './components/pages/HistoriaPage';
import SessionTracker from './components/SessionTracker';
import LogsDashboard from './components/admin/logs/LogsDashboard';
import Login from './components/admin/Login';
import DashboardLayout from './components/admin/DashboardLayout';
import DashboardHome from './components/admin/DashboardHome';
import AnalyticsDashboard from './components/admin/AnalyticsDashboard';
import StoryList from './components/admin/stories/StoryList';
import StoryForm from './components/admin/stories/StoryForm';
import HeritageList from './components/admin/heritage/HeritageList';
import HeritageForm from './components/admin/heritage/HeritageForm';
import ExhibitionList from './components/admin/exhibitions/ExhibitionList';
import ExhibitionForm from './components/admin/exhibitions/ExhibitionForm';
import EventList from './components/admin/events/EventList';
import EventForm from './components/admin/events/EventForm';
import ArtifactList from './components/admin/artifacts/ArtifactList';
import ArtifactForm from './components/admin/artifacts/ArtifactForm';
import Settings from './components/admin/Settings';
import NotFound from './components/pages/NotFound';
import CommentsList from './components/admin/comments/CommentsList';
import UserList from './components/admin/users/UserList';
import UserForm from './components/admin/users/UserForm';
import TestemunhosList from './components/admin/testemunhos/TestemunhosList';
import TestemunhoForm from './components/admin/testemunhos/TestemunhoForm';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Home Page Component
const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <FeaturedStories />
      <Immersion />
      <LifeStories />
      <Heritage />
      <Exhibitions />
      <LogoCloud />
    </>
  );
};


const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-body bg-background text-on-surface selection:bg-primary-container selection:text-on-primary">
      <SessionTracker />
      <ScrollToTop />
      <Header />
      <main className="flex-grow pt-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="logs" element={<LogsDashboard />} />
            <Route path="stories" element={<StoryList />} />
            <Route path="stories/create" element={<StoryForm />} />
            <Route path="stories/edit/:id" element={<StoryForm />} />
            <Route path="heritage" element={<HeritageList />} />
            <Route path="heritage/create" element={<HeritageForm />} />
            <Route path="heritage/edit/:id" element={<HeritageForm />} />
            <Route path="exhibitions" element={<ExhibitionList />} />
            <Route path="exhibitions/create" element={<ExhibitionForm />} />
            <Route path="exhibitions/edit/:id" element={<ExhibitionForm />} />
            <Route path="events" element={<EventList />} />
            <Route path="events/create" element={<EventForm />} />
            <Route path="events/edit/:id" element={<EventForm />} />
            <Route path="artifacts" element={<ArtifactList />} />
            <Route path="artifacts/create" element={<ArtifactForm />} />
            <Route path="artifacts/edit/:id" element={<ArtifactForm />} />
            <Route path="comments" element={<CommentsList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/create" element={<UserForm />} />
            <Route path="users/edit/:id" element={<UserForm />} />
            <Route path="testemunhos" element={<TestemunhosList />} />
            <Route path="testemunhos/create" element={<TestemunhoForm />} />
            <Route path="testemunhos/edit/:id" element={<TestemunhoForm />} />
            <Route path="*" element={<DashboardHome />} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre-museu" element={<SobreMuseu />} />
          <Route path="/apresentacao-empresa" element={<ApresentacaoEmpresa />} />
          <Route path="/geracao" element={<Geracao />} />
          <Route path="/transporte" element={<Transporte />} />
          <Route path="/distribuicao" element={<Distribuicao />} />
          <Route path="/comercial" element={<Comercial />} />
          <Route path="/historia-geracao" element={<HistoriaGeracao />} />
          <Route path="/historia-transporte" element={<HistoriaTransporte />} />
          <Route path="/historia-distribuicao" element={<HistoriaDistribuicao />} />
          <Route path="/historia-comercializacao" element={<HistoriaComercial />} />
          <Route path="/galeria-presidentes" element={<GaleriaPresidentes />} />
          <Route path="/patrimonio-geracao" element={<PatrimonioGeracao />} />
          <Route path="/patrimonio-transporte" element={<PatrimonioTransporte />} />
          <Route path="/patrimonio-distribuicao" element={<PatrimonioDistribuicao />} />
          <Route path="/patrimonio-comercial" element={<PatrimonioComercial />} />
          <Route path="/transmissao-sul" element={<TransmissaoSul />} />
          <Route path="/transmissao-centro" element={<TransmissaoCentro />} />
          <Route path="/transmissao-norte" element={<TransmissaoNorte />} />
          <Route path="/exposicoes" element={<Exposicoes />} />
          <Route path="/artigo/:id" element={<ArticleDetail />} />
          <Route path="/patrimonio/:id" element={<PatrimonioDetail />} />
          <Route path="/exposicao/:id" element={<ExposicaoDetail />} />
          <Route path="/evento/:id" element={<EventoDetail />} />
          <Route path="/artefato/:id" element={<ArtefatoDetail />} />
          <Route path="/historia" element={<HistoriaPage title="História da EDM" subtitle="Conheça a nossa história de" description="A Electricidade de Moçambique tem 48 anos de história ao serviço do povo moçambicano. Explore os momentos mais marcantes da nossa jornada." category="" />} />
          <Route path="/artefatos-geracao" element={<ArtefatosGeracao />} />
          <Route path="/artefatos-transporte" element={<ArtefatosTransporte />} />
          <Route path="/artefatos-distribuicao" element={<ArtefatosDistribuicao />} />
          <Route path="/artefatos-comercial" element={<ArtefatosComercial />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;