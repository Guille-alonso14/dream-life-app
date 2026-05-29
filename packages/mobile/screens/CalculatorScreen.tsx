import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, StyleSheet, Modal,
} from 'react-native';

const DEFAULT_EXPENSES = {
  housing: 1200,
  food: 400,
  transport: 200,
  health: 100,
  leisure: 150,
  other: 200,
};

const LABELS: Record<string, string> = {
  housing: 'Vivienda',
  food: 'Alimentación',
  transport: 'Transporte',
  health: 'Salud y seguros',
  leisure: 'Ocio',
  other: 'Otros',
};

const LIFESTYLE_LEVELS = {
  balanced:    { label: 'Equilibrado',  extra: 0,    icon: '🌿' },
  comfortable: { label: 'Confortable',  extra: 500,  icon: '🛋️' },
  premium:     { label: 'Premium',      extra: 1500, icon: '💎' },
};

const EXTRAS = [
  { id: 'travel', label: 'Viajes', amount: 200, emoji: '✈️' },
  { id: 'training', label: 'Formación', amount: 100, emoji: '📚' },
  { id: 'restaurants', label: 'Restaurantes', amount: 150, emoji: '🍽️' },
  { id: 'culture', label: 'Cultura', amount: 80, emoji: '🎭' },
  { id: 'fashion', label: 'Moda', amount: 120, emoji: '👗' },
  { id: 'gym', label: 'Gimnasio', amount: 60, emoji: '🏋️' },
];

const fmt = (v: number) => '€' + Math.round(v).toLocaleString('es-ES');

interface Props {
  uid: string | null;
  onSave: (name: string, data: any) => void;
}

export default function CalculatorScreen({ uid, onSave }: Props) {
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
  const [savingsPct, setSavingsPct] = useState(10);
  const [investPct, setInvestPct] = useState(5);
  const [lifestyle, setLifestyle] = useState<keyof typeof LIFESTYLE_LEVELS>('balanced');
  const [activeExtras, setActiveExtras] = useState<string[]>([]);
  const [scenarioName, setScenarioName] = useState('');
  const [showSave, setShowSave] = useState(false);

  const totalExpenses = Object.values(expenses).reduce((s, v) => s + v, 0);
  const lifestyleExtra = LIFESTYLE_LEVELS[lifestyle].extra;
  const extrasTotal = activeExtras.reduce((s, id) => {
    const e = EXTRAS.find(x => x.id === id);
    return s + (e?.amount ?? 0);
  }, 0);
  const base = totalExpenses + lifestyleExtra + extrasTotal;
  const totalPct = (savingsPct + investPct) / 100;
  const netNeeded = totalPct < 1 ? base / (1 - totalPct) : base * 2;
  const grossAnnual = (netNeeded * 12) / 0.75;

  const toggleExtra = (id: string) => {
    setActiveExtras(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  function handleSave() {
    if (!scenarioName.trim()) return;
    onSave(scenarioName.trim(), {
      grossAnnual: Math.round(grossAnnual),
      netNeeded: Math.round(netNeeded),
    });
    setScenarioName('');
    setShowSave(false);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

      {/* Hero */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>SALARIO BRUTO ANUAL</Text>
        <Text style={styles.heroValue}>{fmt(grossAnnual)}</Text>
        <Text style={styles.heroSub}>{fmt(netNeeded)}/mes neto</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={() => setShowSave(true)}>
          <Text style={styles.saveBtnText}>Guardar escenario →</Text>
        </TouchableOpacity>
      </View>

      {/* Gastos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gastos mensuales</Text>
        {Object.keys(expenses).map((key) => (
          <View key={key} style={styles.inputRow}>
            <Text style={styles.inputLabel}>{LABELS[key]}</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.prefix}>€</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(expenses[key as keyof typeof expenses])}
                onChangeText={(v) => setExpenses(prev => ({ ...prev, [key]: Number(v) || 0 }))}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Objetivos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Objetivos financieros</Text>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Ahorro mensual</Text>
          <Text style={styles.sliderValue}>{savingsPct}%</Text>
        </View>
        <View style={styles.sliderButtons}>
          {[0, 5, 10, 15, 20, 25, 30].map(v => (
            <TouchableOpacity
              key={v}
              style={[styles.pctBtn, savingsPct === v && styles.pctBtnActive]}
              onPress={() => setSavingsPct(v)}
            >
              <Text style={[styles.pctBtnText, savingsPct === v && styles.pctBtnTextActive]}>{v}%</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.sliderRow, { marginTop: 16 }]}>
          <Text style={styles.sliderLabel}>Inversión mensual</Text>
          <Text style={styles.sliderValue}>{investPct}%</Text>
        </View>
        <View style={styles.sliderButtons}>
          {[0, 5, 10, 15, 20, 25].map(v => (
            <TouchableOpacity
              key={v}
              style={[styles.pctBtn, investPct === v && styles.pctBtnActive]}
              onPress={() => setInvestPct(v)}
            >
              <Text style={[styles.pctBtnText, investPct === v && styles.pctBtnTextActive]}>{v}%</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Estilo de vida */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estilo de vida</Text>
        <View style={styles.lifestyleRow}>
          {(Object.entries(LIFESTYLE_LEVELS) as any[]).map(([key, lvl]) => (
            <TouchableOpacity
              key={key}
              style={[styles.lifestyleCard, lifestyle === key && styles.lifestyleActive]}
              onPress={() => setLifestyle(key)}
            >
              <Text style={styles.lifestyleIcon}>{lvl.icon}</Text>
              <Text style={styles.lifestyleName}>{lvl.label}</Text>
              <Text style={styles.lifestyleCost}>{lvl.extra === 0 ? '—' : `+€${lvl.extra}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.inputLabel, { marginTop: 16, marginBottom: 8 }]}>Extras</Text>
        <View style={styles.tagsWrap}>
          {EXTRAS.map((extra) => (
            <TouchableOpacity
              key={extra.id}
              style={[styles.tag, activeExtras.includes(extra.id) && styles.tagActive]}
              onPress={() => toggleExtra(extra.id)}
            >
              <Text style={[styles.tagText, activeExtras.includes(extra.id) && styles.tagTextActive]}>
                {extra.emoji} {extra.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Modal */}
      <Modal visible={showSave} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Guardar escenario</Text>
            <Text style={styles.modalSub}>Ponle un nombre para identificarlo</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ej: Vida en Madrid sin coche"
              value={scenarioName}
              onChangeText={setScenarioName}
              autoFocus
            />
            <View style={styles.modalResult}>
              <Text style={styles.modalResultLabel}>Bruto anual</Text>
              <Text style={styles.modalResultValue}>{fmt(grossAnnual)}</Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowSave(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, !scenarioName.trim() && { opacity: 0.5 }]}
                onPress={handleSave}
                disabled={!scenarioName.trim()}
              >
                <Text style={styles.confirmBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f7f5f0' },
  container: { padding: 20, paddingBottom: 60 },
  heroCard: {
    backgroundColor: '#2a6049', borderRadius: 20, padding: 28,
    alignItems: 'center', marginBottom: 16,
  },
  heroLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: 1, marginBottom: 8 },
  heroValue: { fontSize: 42, fontWeight: '300', color: 'white', marginBottom: 4 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 20 },
  saveBtn: { backgroundColor: 'white', borderRadius: 999, paddingHorizontal: 24, paddingVertical: 10 },
  saveBtnText: { color: '#2a6049', fontWeight: '500', fontSize: 14 },
  card: {
    backgroundColor: 'white', borderRadius: 16, padding: 20,
    marginBottom: 16, elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '400', color: '#1a1814', marginBottom: 16 },
  inputRow: { marginBottom: 12 },
  inputLabel: { fontSize: 11, color: '#a09d98', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center' },
  prefix: { fontSize: 15, color: '#a09d98', marginRight: 6 },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#e8e5e0', borderRadius: 10,
    padding: 10, fontSize: 15, color: '#1a1814', backgroundColor: '#f7f5f0',
  },
  sliderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sliderLabel: { fontSize: 15, color: '#1a1814' },
  sliderValue: { fontSize: 16, fontWeight: '500', color: '#2a6049' },
  sliderButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pctBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    borderWidth: 1, borderColor: '#e8e5e0', backgroundColor: '#f7f5f0',
  },
  pctBtnActive: { backgroundColor: '#2a6049', borderColor: '#2a6049' },
  pctBtnText: { fontSize: 13, color: '#6b6760' },
  pctBtnTextActive: { color: 'white', fontWeight: '500' },
  lifestyleRow: { flexDirection: 'row', gap: 10 },
  lifestyleCard: {
    flex: 1, alignItems: 'center', padding: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#e8e5e0', backgroundColor: '#f7f5f0',
  },
  lifestyleActive: { borderColor: '#2a6049', borderWidth: 2, backgroundColor: '#eaf4ef' },
  lifestyleIcon: { fontSize: 20, marginBottom: 4 },
  lifestyleName: { fontSize: 12, fontWeight: '500', color: '#1a1814', textAlign: 'center' },
  lifestyleCost: { fontSize: 10, color: '#a09d98', marginTop: 2 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#e8e5e0' },
  tagActive: { backgroundColor: '#eaf4ef', borderColor: '#2a6049' },
  tagText: { fontSize: 13, color: '#6b6760' },
  tagTextActive: { color: '#2a6049' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modal: { backgroundColor: 'white', borderRadius: 24, padding: 28, width: '100%' },
  modalTitle: { fontSize: 22, fontWeight: '400', color: '#1a1814', marginBottom: 6 },
  modalSub: { fontSize: 14, color: '#6b6760', marginBottom: 16 },
  modalInput: {
    borderWidth: 1, borderColor: '#e8e5e0', borderRadius: 12,
    padding: 12, fontSize: 15, color: '#1a1814', marginBottom: 16,
  },
  modalResult: {
    backgroundColor: '#eaf4ef', borderRadius: 12, padding: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  modalResultLabel: { fontSize: 14, color: '#6b6760' },
  modalResultValue: { fontSize: 20, fontWeight: '500', color: '#2a6049' },
  modalActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  cancelBtn: { borderWidth: 1, borderColor: '#e8e5e0', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  cancelBtnText: { fontSize: 14, color: '#6b6760' },
  confirmBtn: { backgroundColor: '#2a6049', borderRadius: 10, paddingHorizontal: 22, paddingVertical: 10 },
  confirmBtnText: { fontSize: 14, color: 'white', fontWeight: '500' },
});