import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../services/apiClient';
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  AlignLeft, 
  Type,
  Loader2,
  Save
} from 'lucide-react';
import { ImageUploadField } from '../../ui/ImageUploadField';
import { DynamicGalleryField } from '../../ui/DynamicGalleryField';
import { useToast } from '../../ui/Toast';

const HeritageForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { showToast, ToastComponent } = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  
  // DB Fields
  const [nome, setNome] = useState('');
  const [sigla, setSigla] = useState('');
  const [area_negocio, setAreaNegocio] = useState('');
  const [tipo, setTipo] = useState('Substacao');
  const [circuito, setCircuito] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [ano_entrada_servico, setAnoEntradaServico] = useState('');
  const [potencia_instalada_inicial, setPotenciaInstaladaInicial] = useState('');
  const [potencia_instalada_actual, setPotenciaInstaladaActual] = useState('');
  const [niveis_tensao, setNiveisTensao] = useState('');
  const [transformadores_potencia, setTransformadoresPotencia] = useState('');
  const [barramento_inicial, setBarramentoInicial] = useState('');
  const [barramento_final, setBarramentoFinal] = useState('');
  const [capacidade_linha, setCapacidadeLinha] = useState('');
  const [condutor, setCondutor] = useState('');
  const [comprimento, setComprimento] = useState('');
  const [tipo_postes, setTipoPostes] = useState('');
  const [tipo_condutor, setTipoCondutor] = useState('');
  const [tipo_isoladores, setTipoIsoladores] = useState('');
  const [cabo_guarda, setCaboGuarda] = useState('');
  const [foto, setFoto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nota, setNota] = useState('');
  const [galeria, setGaleria] = useState<string[]>(['', '', '', '']);

  useEffect(() => {
    if (isEditing && id) {
      loadHeritage(parseInt(id));
    }
  }, [id, isEditing]);

  const loadHeritage = async (hId: number) => {
    try {
      setLoading(true);
      const data = await api.getPatrimonio(hId);
      setNome(data.nome || '');
      setSigla(data.sigla || '');
      setAreaNegocio(data.area_negocio || '');
      setTipo(data.tipo || 'Substacao');
      setCircuito(data.circuito || '');
      setLocalizacao(data.localizacao || '');
      setAnoEntradaServico(data.ano_entrada_servico || '');
      setPotenciaInstaladaInicial(data.potencia_instalada_inicial || '');
      setPotenciaInstaladaActual(data.potencia_instalada_actual || '');
      setNiveisTensao(data.niveis_tensao || '');
      setTransformadoresPotencia(data.transformadores_potencia || '');
      setBarramentoInicial(data.barramento_inicial || '');
      setBarramentoFinal(data.barramento_final || '');
      setCapacidadeLinha(data.capacidade_linha || '');
      setCondutor(data.condutor || '');
      setComprimento(data.comprimento || '');
      setTipoPostes(data.tipo_postes || '');
      setTipoCondutor(data.tipo_condutor || '');
      setTipoIsoladores(data.tipo_isoladores || '');
      setCaboGuarda(data.cabo_guarda || '');
      setFoto(data.foto || '');
      setDescricao(data.descricao || '');
      setNota(data.nota || '');
      
      if (data.galeria) {
        const parsedGallery = typeof data.galeria === 'string' ? JSON.parse(data.galeria) : data.galeria;
        const paddedGallery = [...parsedGallery];
        while (paddedGallery.length < 4) paddedGallery.push('');
        setGaleria(paddedGallery.slice(0, 4));
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao carregar patrimônio.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        nome,
        sigla,
        area_negocio,
        tipo,
        circuito,
        localizacao,
        ano_entrada_servico,
        potencia_instalada_inicial,
        potencia_instalada_actual,
        niveis_tensao,
        transformadores_potencia,
        barramento_inicial,
        barramento_final,
        cabo_guarda,
        capacidade_linha,
        condutor,
        comprimento,
        tipo_postes,
        tipo_condutor,
        tipo_isoladores,
        foto,
        descricao,
        nota,
        galeria: galeria.filter(url => url.trim() !== '')
      };

      if (isEditing && id) {
        await api.updatePatrimonio(parseInt(id), payload);
      } else {
        await api.createPatrimonio(payload);
      }

      showToast(isEditing ? 'Patrimônio atualizado com sucesso!' : 'Patrimônio criado com sucesso!', 'success');
      setTimeout(() => navigate('/admin/dashboard/heritage'), 2000);
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar patrimônio.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateGalleryItem = (index: number, value: string) => {
    const newGal = [...galeria];
    newGal[index] = value;
    setGaleria(newGal);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <ToastComponent />
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/dashboard/heritage')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Editar Item de Património' : 'Adicionar Novo Património'}</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {/* Main Image */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="max-w-xl">
               <ImageUploadField
                 label="Imagem Principal"
                 value={foto}
                 onChange={setFoto}
                 placeholder="URL da imagem principal (ex: /patrimonio/motor.jpg)"
               />
            </div>
          </section>

          {/* General Info */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Informação Geral</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Património / Ativo *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Ex: Central Hidroeléctrica de Mavuzi"
                  className="block w-full px-4 py-2 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sigla</label>
                <input
                  type="text"
                  value={sigla}
                  onChange={e => setSigla(e.target.value)}
                  placeholder="Ex: CHM"
                  className="block w-full px-4 py-2 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Área de Negócio *</label>
                <select
                  value={area_negocio}
                  onChange={e => setAreaNegocio(e.target.value)}
                  className="block w-full px-4 py-2 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Geração">Geração</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Distribuição">Distribuição</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ativo</label>
                <select
                  value={tipo}
                  onChange={e => setTipo(e.target.value)}
                  className="block w-full px-4 py-2 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Outro">Outro</option>
                  <option value="Edificio">Edifício</option>
                  
                  {/* Transmission specific */}
                  {area_negocio === 'Transporte' && (
                    <>
                      <option value="Substacao">Subestação</option>
                      <option value="Linha de Transmissao">Linha de Transmissão</option>
                    </>
                  )}
                  
                  {/* Generation specific */}
                  {area_negocio === 'Geração' && (
                    <>
                      <option value="Central Hidroelectrica">Central Hidroeléctrica</option>
                      <option value="Central Termica">Central Térmica</option>
                      <option value="Central Solar">Central Solar</option>
                    </>
                  )}

                  {/* Distribution specific */}
                  {area_negocio === 'Distribuição' && (
                    <>
                      <option value="Rede de Distribuicao">Rede de Distribuição</option>
                      <option value="Posto de Transformacao">Posto de Transformação (PT)</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                <input
                  type="text"
                  value={localizacao}
                  onChange={e => setLocalizacao(e.target.value)}
                  placeholder="Ex: Província de Manica, Distrito de Sussundenga"
                  className="block w-full px-4 py-2 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ano Entrada em Serviço</label>
                <input
                  type="text"
                  value={ano_entrada_servico}
                  onChange={e => setAnoEntradaServico(e.target.value)}
                  placeholder="Ex: 1957"
                  className="block w-full px-4 py-2 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </section>

          {/* Technical Specification Section - Dynamic based on area_negocio */}
          {area_negocio === 'Transporte' && (
            <>
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="w-1 h-6 bg-orange-500 rounded-full" />
                  <h2 className="text-lg font-semibold text-gray-900">Especificações Técnicas</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Potência Instalada (Entrada)</label>
                    <input
                      type="text"
                      value={potencia_instalada_inicial}
                      onChange={e => setPotenciaInstaladaInicial(e.target.value)}
                      placeholder="Ex: 40 MW"
                      className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Potência Instalada (Actual)</label>
                    <input
                      type="text"
                      value={potencia_instalada_actual}
                      onChange={e => setPotenciaInstaladaActual(e.target.value)}
                      placeholder="Ex: 50 MW"
                      className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Níveis de Tensão</label>
                    <input
                      type="text"
                      value={niveis_tensao}
                      onChange={e => setNiveisTensao(e.target.value)}
                      placeholder="Ex: 110/66 kV"
                      className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Transformadores de Potência</label>
                    <input
                      type="text"
                      value={transformadores_potencia}
                      onChange={e => setTransformadoresPotencia(e.target.value)}
                      placeholder="Ex: 3 Unidades (ABB, 20 MVA)"
                      className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Circuito / Linha</label>
                    <input
                      type="text"
                      value={circuito}
                      onChange={e => setCircuito(e.target.value)}
                      placeholder="Ex: Linha Mavuzi - Beira"
                      className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Barramento Inicial</label>
                      <input
                        type="text"
                        value={barramento_inicial}
                        onChange={e => setBarramentoInicial(e.target.value)}
                        placeholder="Início"
                        className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Barramento Final</label>
                      <input
                        type="text"
                        value={barramento_final}
                        onChange={e => setBarramentoFinal(e.target.value)}
                        placeholder="Fim"
                        className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Comprimento (km)</label>
                      <input
                        type="text"
                        value={comprimento}
                        onChange={e => setComprimento(e.target.value)}
                        placeholder="km"
                        className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Capacidade Linha</label>
                      <input
                        type="text"
                        value={capacidade_linha}
                        onChange={e => setCapacidadeLinha(e.target.value)}
                        className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Condutor</label>
                      <input
                        type="text"
                        value={condutor}
                        onChange={e => setCondutor(e.target.value)}
                        className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tipo de Postes</label>
                      <input
                        type="text"
                        value={tipo_postes}
                        onChange={e => setTipoPostes(e.target.value)}
                        className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Cabo Guarda</label>
                      <input
                        type="text"
                        value={cabo_guarda}
                        onChange={e => setCaboGuarda(e.target.value)}
                        className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tipo de Isoladores</label>
                      <input
                        type="text"
                        value={tipo_isoladores}
                        onChange={e => setTipoIsoladores(e.target.value)}
                        className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tipo de Condutor</label>
                      <input
                        type="text"
                        value={tipo_condutor}
                        onChange={e => setTipoCondutor(e.target.value)}
                        className="block w-full px-4 py-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                   </div>
                </div>
              </section>

              <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">Notas Técnicas Adicionais / Historial</label>
                <textarea 
                  rows={4}
                  value={nota}
                  onChange={e => setNota(e.target.value)}
                  className="w-full p-4 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-700 bg-orange-50/10"
                  placeholder="Observações complementares ou historial técnico específico..."
                ></textarea>
              </section>
            </>
          )}

          {/* Description & Gallery - Always show */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Descrição Geral / Contexto Histórico</label>
              <textarea 
                rows={6}
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                className="w-full p-4 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                placeholder="Descreva o contexto histórico deste item ou activo..."
              ></textarea>
            </div>
          </section>

          {/* Gallery */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <DynamicGalleryField
               images={galeria}
               onChange={setGaleria}
             />
          </section>

          {/* Actions - Standardized Bottom Layout */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-8 border-t border-gray-200">
            <button 
              type="button"
              onClick={() => navigate('/admin/dashboard/heritage')}
              className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditing ? 'Salvar Alterações' : 'Criar Património'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default HeritageForm;
