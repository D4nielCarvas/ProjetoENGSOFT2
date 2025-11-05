import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTransactions } from '../context/TransactionContext';

const { width: screenWidth } = Dimensions.get('window');

const ReportsScreen: React.FC = () => {
  const { transactions } = useTransactions();

  const financialSummary = useMemo(() => {
    const revenues = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const balance = revenues - expenses;

    return { revenues, expenses, balance };
  }, [transactions]);

  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + Math.abs(t.amount));
      });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Preparar dados para o gráfico de pizza
  const chartData = expensesByCategory.map((item, index) => ({
    name: item.category,
    amount: item.amount,
    color: getChartColor(index),
    legendFontColor: '#2c3e50',
    legendFontSize: 14,
  }));

  function getChartColor(index: number): string {
    const colors = [
      '#e74c3c', // Vermelho
      '#3498db', // Azul
      '#f39c12', // Laranja
      '#2ecc71', // Verde
      '#9b59b6', // Roxo
      '#1abc9c', // Turquesa
      '#34495e', // Cinza escuro
      '#e67e22', // Laranja escuro
    ];
    return colors[index % colors.length];
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Relatório Financeiro</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cards de Resumo */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.revenueCard]}>
            <Text style={styles.cardLabel}>Total de Receitas</Text>
            <Text style={[styles.cardValue, styles.revenueValue]}>
              {formatCurrency(financialSummary.revenues)}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.cardLabel}>Total de Despesas</Text>
            <Text style={[styles.cardValue, styles.expenseValue]}>
              {formatCurrency(financialSummary.expenses)}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.balanceCard]}>
            <Text style={styles.cardLabel}>Saldo</Text>
            <Text style={[
              styles.cardValue,
              { color: financialSummary.balance >= 0 ? '#27ae60' : '#e74c3c' }
            ]}>
              {formatCurrency(financialSummary.balance)}
            </Text>
          </View>
        </View>

        {/* Gráfico de Pizza */}
        {chartData.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Despesas por Categoria</Text>
            
            <PieChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
              absolute
            />
          </View>
        )}

        {/* Lista de Categorias */}
        {expensesByCategory.length > 0 && (
          <View style={styles.categoriesContainer}>
            <Text style={styles.categoriesTitle}>Detalhamento por Categoria</Text>
            
            {expensesByCategory.map((item, index) => (
              <View key={item.category} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[
                    styles.categoryColor,
                    { backgroundColor: getChartColor(index) }
                  ]} />
                  <Text style={styles.categoryName}>{item.category}</Text>
                </View>
                <Text style={styles.categoryAmount}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Mensagem quando não há despesas */}
        {expensesByCategory.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Nenhuma despesa encontrada para gerar o relatório.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  summaryContainer: {
    padding: 20,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  revenueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  balanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  cardLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  revenueValue: {
    color: '#27ae60',
  },
  expenseValue: {
    color: '#e74c3c',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  emptyState: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default ReportsScreen;