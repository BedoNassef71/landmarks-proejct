import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { CitiesService } from '../../cities/cities.service';
import { TagsService } from '../../tags/tags.service';
import { LandmarksService } from '../../landmarks/landmarks.service';
import { LandmarkDocument } from '../../landmarks/entities/landmark.entity';
import { TagDocument } from '../../tags/entities/tag.entity';
import { CityDocument } from '../../cities/entities/city.entity';

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly tagsService: TagsService,
    private readonly landmarksService: LandmarksService,
  ) {}

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const targetName = this.getTargetName(validationArguments);
    if (targetName === 'CreateCityDto') {
      return this.isCityNameUnique(value);
    } else if (targetName === 'CreateTagDto') {
      return this.isTagNameUnique(value);
    }
    return this.isLandmarkNameUnique(value);
  }

  defaultMessage(): string {
    return 'The provided value already exists.';
  }

  private getTargetName(validationArguments?: ValidationArguments): string {
    return validationArguments?.targetName || '';
  }

  private async isCityNameUnique(cityName: string): Promise<boolean> {
    const cityExists: CityDocument | undefined =
      await this.citiesService.findByName(cityName);
    return !cityExists;
  }
  private async isTagNameUnique(tagName: string): Promise<boolean> {
    const tagExists: TagDocument | undefined =
      await this.tagsService.findByName(tagName);
    return !tagExists;
  }

  private async isLandmarkNameUnique(cityName: string): Promise<boolean> {
    const landmarkExists: LandmarkDocument | undefined =
      await this.landmarksService.findByName(cityName);
    return !landmarkExists;
  }
}