"use client";

import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Banknote, HelpCircle, TrendingDown, TrendingUp, CandlestickChart } from 'lucide-react';

import { calculateBOBValue, type CalculateBOBValueOutput } from '@/ai/flows/calculate-bob-value';
import { getRealTimeExchangeRate } from '@/ai/flows/get-real-time-exchange-rate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const formSchema = z.object({
  initialBobAmount: z.coerce.number().positive({ message: "Debe ser un número positivo." }),
  p2pRate: z.coerce.number().positive({ message: "Debe ser un número positivo." }),
  officialRate: z.coerce.number().positive({ message: "Debe ser un número positivo." }),
});

type FormValues = z.infer<typeof formSchema>;

interface Result extends CalculateBOBValueOutput {
    initialBobAmount: number;
}

export function Calculator() {
  const [loadingRate, setLoadingRate] = useState(false);
  const [loadingCalculation, setLoadingCalculation] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialBobAmount: '' as any,
      p2pRate: '' as any,
      officialRate: '' as any,
    },
  });

  const { handleSubmit, setValue } = form;

  const onSubmit = useCallback(async (data: FormValues) => {
    setLoadingCalculation(true);
    setResult(null);
    try {
      const calculationResult = await calculateBOBValue({
        initialBOBAmount: data.initialBobAmount,
        p2pRate: data.p2pRate,
        officialBOBToUSDTExchangeRate: data.officialRate,
      });

      setResult({
        ...calculationResult,
        initialBobAmount: data.initialBobAmount,
      });
    } catch (error) {
       console.error(error);
       toast({
        variant: "destructive",
        title: "Error de cálculo",
        description: "Ocurrió un error al calcular el valor. Revisa los datos ingresados.",
      });
    } finally {
      setLoadingCalculation(false);
    }
  }, [toast]);

  const handleFetchRate = async () => {
    setLoadingRate(true);
    try {
      const { exchangeRate } = await getRealTimeExchangeRate();
      const formattedRate = parseFloat(exchangeRate.toFixed(4));
      setValue('officialRate', formattedRate, { shouldValidate: true });
      toast({
        title: "Tasa de cambio actualizada",
        description: `La tasa oficial BOB/USDT es ${exchangeRate}.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo obtener la tasa de cambio. Por favor, ingrésala manualmente.",
      });
    } finally {
      setLoadingRate(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Calculadora de Valor</CardTitle>
            <CardDescription>Ingresa los datos de tu transacción para calcular el valor actual de tu dinero.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                    control={form.control}
                    name="initialBobAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-1">
                            Monto Inicial (BOB)
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>La cantidad total en Bolivianos (BOB) que gastaste.</p>
                                </TooltipContent>
                            </Tooltip>
                        </FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" step="any" placeholder="Ej: 700" {...field} className="pl-10" />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="p2pRate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-1">
                            Tasa de Compra (P2P)
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>La tasa de cambio que usaste en la transacción P2P de Binance.</p>
                                </TooltipContent>
                            </Tooltip>
                        </FormLabel>
                        <FormControl>
                            <div className="relative">
                                <CandlestickChart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" step="any" placeholder="Ej: 6.96" {...field} className="pl-10" />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                 <FormField
                  control={form.control}
                  name="officialRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Tasa Oficial (BOB/USDT)
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>El tipo de cambio oficial actual. Puedes obtenerlo automáticamente o ingresarlo.</p>
                            </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                            <div className="relative flex-grow">
                                <CandlestickChart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" step="any" placeholder="Ej: 6.86" {...field} className="pl-10" />
                            </div>
                        </FormControl>
                        <Button type="button" variant="outline" onClick={handleFetchRate} disabled={loadingRate}>
                          {loadingRate ? <Loader2 className="h-4 w-4 animate-spin" /> : "Obtener Tasa"}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loadingCalculation}>
                  {loadingCalculation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Calcular Valor
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {result && (
            <Card className="w-full animate-in fade-in-50 duration-500">
                <CardHeader>
                    <CardTitle>Resultados</CardTitle>
                    <CardDescription>Este es el valor actual de tu inversión.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 text-base md:text-lg">
                    <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                        <span className="flex items-center gap-2 font-medium text-muted-foreground">
                            <Banknote className="h-5 w-5"/>
                            Monto Inicial
                        </span>
                        <span className="font-bold">{result.initialBobAmount.toFixed(2)} Bs</span>
                    </div>
                     <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                        <span className="flex items-center gap-2 font-medium text-muted-foreground">
                            <TrendingUp className="h-5 w-5"/>
                            USDT Adquiridos
                        </span>
                        <span className="font-bold">{result.usdtPurchased.toFixed(2)} $</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-primary/20 p-4">
                        <span className="flex items-center gap-2 font-medium text-primary">
                            <TrendingUp className="h-5 w-5"/>
                            Valor Disponible
                        </span>
                        <span className="font-bold text-primary">{result.availableBOBValue.toFixed(2)} Bs</span>
                    </div>
                     <div className={cn(
                        "flex items-center justify-between rounded-lg p-4",
                        result.percentageReduction <= 0 ? "bg-destructive/20 text-destructive" : "bg-green-500/20 text-green-500"
                     )}>
                        <span className="flex items-center gap-2 font-medium">
                            <TrendingDown className="h-5 w-5"/>
                            {result.percentageReduction <= 0 ? "Reducción de Valor" : "Ganancia de Valor"}
                        </span>
                        <span className="font-bold">
                            {result.percentageReduction.toFixed(2)}%
                        </span>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
