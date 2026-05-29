import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';

const fmt = (v: number) => '€' + Math.round(v).toLocaleString('es-ES');

interface Props {
  scenarios: any[];
  onDelete: (id: string, name: string) => void;
}

export default function ScenariosScreen({ scenarios, onDelete }: Props) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mis escenarios</Text>
      <Text style={styles.subtitle}>{scenarios.length} escenarios guardados</Text>

      {scenarios.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📂</Text>
          <Text style={styles.emptyTitle}>Sin escenarios</Text>
          <Text style={styles.emptySub}>Calcula tu salario ideal y guárdalo desde la calculadora.</Text>
        </View>
      ) : (
        scenarios.map((s, i) => (
          <View key={s.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{s.name}</Text>
              <Text style={styles.cardDate}>
                {new Date(s.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </Text>
            </View>
            <Text style={styles.cardHero}>
              {fmt(s.grossAnnual)}<Text style={styles.cardHeroSub}>/año</Text>
            </Text>
            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Neto/mes</Text>
                <Text style={styles.metricValue}>{fmt(s.netNeeded)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => onDelete(s.id, s.name)}>
              <Text style={styles.deleteBtn}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f7f5f0' },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 32, fontWeight: '300', color: '#1a1814', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#6b6760', marginBottom: 24 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 22, fontWeight: '400', color: '#1a1814' },
  emptySub: { fontSize: 15, color: '#6b6760', textAlign: 'center' },
  card: {
    backgroundColor: 'white', borderRadius: 16, padding: 20,
    marginBottom: 16, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardName: { fontSize: 16, fontWeight: '500', color: '#1a1814', flex: 1 },
  cardDate: { fontSize: 12, color: '#a09d98' },
  cardHero: { fontSize: 36, fontWeight: '300', color: '#2a6049', marginBottom: 12 },
  cardHeroSub: { fontSize: 16, color: '#6b6760', fontWeight: '400' },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metric: { flex: 1, backgroundColor: '#f7f5f0', borderRadius: 10, padding: 12 },
  metricLabel: { fontSize: 11, color: '#a09d98', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  metricValue: { fontSize: 15, fontWeight: '500', color: '#1a1814' },
  deleteBtn: { fontSize: 13, color: '#a09d98', textAlign: 'right' },
});