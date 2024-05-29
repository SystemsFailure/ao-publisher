import AvitoPublisher from "./AvitoStrategy";
import CianPublisher from "./CianStrategy";
import YoulaPublisher from "./YoulaStrategy";
import { PublisherStrategy } from "./types";

// Контекст стратегии
class PublisherContext {
    private strategy: PublisherStrategy;
  
    constructor(strategy: PublisherStrategy) {
      this.strategy = strategy;
    }
  
    setStrategy(strategy: PublisherStrategy) {
      this.strategy = strategy;
    }
  
    executeStrategy(adsData: any): any {
      const convertedFilePath = this.strategy.convert(adsData);
      return this.strategy.publish(convertedFilePath);
    }

    async validXml(filePath: string) {
      await this.strategy.valid(filePath)
    }
}

// Разделение объектов на отдельные массивы для каждой площадки
function splitAdsByPlatform(ads: any[]): { avitoAds: any[], cianAds: any[], youlaAds: any[] } {
  const avitoAds = ads.filter(ad => ad.Площадка === 'Авито');
  const cianAds = ads.filter(ad => ad.Площадка === 'Циан');
  const youlaAds = ads.filter(ad => ad.Площадка === 'Юла');
  
  return { avitoAds, cianAds, youlaAds };
}

// Стратегическая функция
export async function publishAds(adsData: any[]) {
  const { avitoAds, cianAds, youlaAds } = splitAdsByPlatform(adsData);

  const results = [];

  if (avitoAds.length > 0) {
      const avitoPublisher = new PublisherContext(new AvitoPublisher());
      results.push(avitoPublisher.executeStrategy(avitoAds));
      await avitoPublisher.validXml('')
  }

  if (cianAds.length > 0) {
      const cianPublisher = new PublisherContext(new CianPublisher());
      results.push(cianPublisher.executeStrategy(cianAds));
  }

  if (youlaAds.length > 0) {
      const youlaPublisher = new PublisherContext(new YoulaPublisher());
      results.push(youlaPublisher.executeStrategy(youlaAds));
  }

  return results;
}